package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"gopkg.in/mgo.v2/bson"
)

type Server struct {
	db          *DB
	config      *Config
	mux         *http.ServeMux
	fbValidator *FBValidator

	usersCache  *CachedGetResponse
	recentCache *CachedGetResponse
	routesCache *CachedGetResponse
}

func NewServer(db *DB, config *Config) *Server {
	server := new(Server)
	server.db = db
	server.config = config
	server.fbValidator = NewFBValidator(config)

	server.usersCache = NewCachedGetReponse(server.db, UsersCacheUpdater(0))
	server.recentCache = NewCachedGetReponse(server.db, RecentCacheUpdater(0))
	server.routesCache = NewCachedGetReponse(server.db, RoutesCacheUpdater(0))

	server.usersCache.TriggerUpdate()
	server.recentCache.TriggerUpdate()
	server.routesCache.TriggerUpdate()

	server.mux = http.NewServeMux()
	// GET
	server.mux.HandleFunc("/api/users", server.handleUsers)
	server.mux.HandleFunc("/api/user", server.handleUser)
	server.mux.HandleFunc("/api/recent", server.handleRecent)
	server.mux.HandleFunc("/api/routes", server.handleRoutes)
	server.mux.HandleFunc("/api/logs/pending", server.handleLogsPending)
	// POST
	server.mux.HandleFunc("/api/auth", server.handleAuth)
	server.mux.HandleFunc("/api/log/new", server.handleLogNew)
	server.mux.HandleFunc("/api/log/remove", server.handleLogRemove)
	server.mux.HandleFunc("/api/user/modify", server.handleUserModify)
	server.mux.HandleFunc("/api/admin/log/approve", server.handleAdminLogApprove)
	server.mux.HandleFunc("/api/admin/log/approveAll", server.handleAdminLogApproveAll)
	server.mux.HandleFunc("/api/admin/log/discard", server.handleAdminLogDiscard)
	server.mux.HandleFunc("/api/admin/route/new", server.handleAdminRouteNew)
	server.mux.HandleFunc("/api/admin/route/enable", server.handleAdminRouteEnable)
	server.mux.HandleFunc("/api/admin/route/disable", server.handleAdminRouteDisable)

	server.mux.Handle("/", http.FileServer(http.Dir(config.UIPath)))

	return server
}

func (s *Server) ListenAndServe() error {
	return (&http.Server{
		Addr:         s.config.LAddrHTTPS,
		Handler:      s.mux,
		ReadTimeout:  32 * time.Second,
		WriteTimeout: 32 * time.Second,
	}).ListenAndServeTLS(s.config.CACert, s.config.CAKey)
}

func (s *Server) handleUsers(w http.ResponseWriter, r *http.Request) {
	s.usersCache.Respond(w, r)
}

func (s *Server) handleRecent(w http.ResponseWriter, r *http.Request) {
	s.recentCache.Respond(w, r)
}

func (s *Server) handleRoutes(w http.ResponseWriter, r *http.Request) {
	s.routesCache.Respond(w, r)
}

func (s *Server) respondUnCached(w http.ResponseWriter, data interface{}) error {
	resp := new(struct {
		Updated bool        `json:"updated"`
		Version int64       `json:"version"`
		Data    interface{} `json:"data"`
	})
	resp.Updated = true
	resp.Version = -1
	resp.Data = data
	return json.NewEncoder(w).Encode(resp)
}

func (s *Server) handleLogsPending(w http.ResponseWriter, r *http.Request) {
	logs, err := s.db.PendingLogs()
	if err != nil {
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}
	s.respondUnCached(w, logs)
}

func (s *Server) handleUser(w http.ResponseWriter, r *http.Request) {
	uid := r.URL.Query().Get("id")
	if uid == "" {
		json.NewEncoder(w).Encode(map[string]string{"error": "expecting 'id'"})
		return
	}
	resp := new(struct {
		User *User         `json:"user"`
		Logs []ClimbingLog `json:"logs"`
	})
	var err error
	if !bson.IsObjectIdHex(uid) {
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid 'id'"})
		return
	}
	resp.User = s.db.GetUser(bson.ObjectIdHex(uid))
	resp.Logs, err = s.db.ClimbingLogs(bson.ObjectIdHex(uid))
	if resp.User == nil || err != nil {
		json.NewEncoder(w).Encode(map[string]string{"error": "getting user info error"})
		return
	}
	s.respondUnCached(w, resp)
}

func (s *Server) isAdmin(FBID string, FBToken string) bool {
	if !s.fbValidator.IsValid(FBID, FBToken) {
		return false
	}
	user := s.db.GetUserFB(FBID)
	if user == nil {
		return false
	}
	return user.Admin
}

func (s *Server) handleAuth(w http.ResponseWriter, r *http.Request) {
	var req struct {
		FBID    string `json:"fb_id"`
		FBToken string `json:"fb_token"`
	}
	json.NewDecoder(r.Body).Decode(&req)
	if req.FBID == "" || req.FBToken == "" {
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid request"})
		return
	}
	isValid := s.fbValidator.IsValid(req.FBID, req.FBToken)
	if !isValid {
		json.NewEncoder(w).Encode(map[string]string{"error": "unauthorized"})
		return
	}
	user := s.db.GetUserFB(req.FBID)
	var err error
	if user == nil {
		user, err = s.createUserFromFacebook(req.FBID, req.FBToken)
		if err != nil {
			json.NewEncoder(w).Encode(map[string]string{"error": "internal error: " + err.Error()})
			return
		}
	}
	json.NewEncoder(w).Encode(map[string]interface{}{"user_id": user.ID})
}

func (s *Server) createUserFromFacebook(FBID string, FBToken string) (*User, error) {
	resp, err := http.Get(fmt.Sprintf("https://graph.facebook.com/v2.1/%s?access_token=%s", FBID, FBToken))
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	var fbResp struct {
		ID    string      `json:"id"`
		Email string      `json:"email"`
		Name  string      `json:"name"`
		Error interface{} `json:"error"`
	}
	if nil != json.NewDecoder(resp.Body).Decode(&fbResp) {
		return nil, err
	}

	if fbResp.Error != nil {
		return nil, errors.New("invalid FBID/FBToken pair")
	}

	if fbResp.ID == "" || fbResp.Name == "" {
		return nil, errors.New("calling Facebook Graph API error")
	}

	user := new(User)
	user.FBID = FBID
	user.Name = fbResp.Name
	user.Email = fbResp.Email
	user.PictureURL = fmt.Sprintf("https://graph.facebook.com/v2.1/%s/picture", FBID)
	user.Since = time.Now()
	user.Updated = time.Now()
	err = s.db.NewUser(user)
	if err != nil {
		return nil, err
	}

	s.usersCache.TriggerUpdate()
	s.recentCache.TriggerUpdate()

	return user, nil
}

func (s *Server) handleLogNew(w http.ResponseWriter, r *http.Request) {
	var req struct {
		FBID    string `json:"fb_id"`
		FBToken string `json:"fb_token"`
		Payload struct {
			RouteID    bson.ObjectId   `json:"route_id"`
			ClimbersID []bson.ObjectId `json:"climbers_id"`
		} `json:"payload"`
	}
	json.NewDecoder(r.Body).Decode(&req)
	if req.FBID == "" || req.FBToken == "" {
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid request"})
		return
	}
	isValid := s.fbValidator.IsValid(req.FBID, req.FBToken)
	if !isValid {
		json.NewEncoder(w).Encode(map[string]string{"error": "unauthorized"})
		return
	}
	if !req.Payload.RouteID.Valid() {
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid route id"})
		return
	}
	for _, id := range req.Payload.ClimbersID {
		if !id.Valid() {
			json.NewEncoder(w).Encode(map[string]string{"error": "invalid climber id"})
			return
		}
	}

	user := s.db.GetUserFB(req.FBID)
	if user == nil {
		json.NewEncoder(w).Encode(map[string]string{"error": "internal error"})
	}
	found := false
	for _, climberID := range req.Payload.ClimbersID {
		if climberID == user.ID {
			found = true
			break
		}
	}
	if !found {
		json.NewEncoder(w).Encode(map[string]string{"error": "unauthorized"})
		return
	}
	log, err := s.db.NewClimbingLog(req.Payload.RouteID, req.Payload.ClimbersID)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]string{"error": "internal error creating the pitch."})
		return
	}
	if !s.config.RequireApprove {
		err = s.db.ApproveLog(log.ID)
		if err != nil {
			json.NewEncoder(w).Encode(map[string]string{"error": "internal error auto-approving the pitch."})
			return
		}
		s.recentCache.TriggerUpdate()
	}
	json.NewEncoder(w).Encode(map[string]string{"result": "ok"})
}

func (s *Server) handleLogRemove(w http.ResponseWriter, r *http.Request) {
	var req struct {
		FBID    string        `json:"fb_id"`
		FBToken string        `json:"fb_token"`
		Payload bson.ObjectId `json:"payload"`
	}
	json.NewDecoder(r.Body).Decode(&req)
	if req.FBID == "" || req.FBToken == "" || !req.Payload.Valid() {
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid request"})
		return
	}
	isValid := s.fbValidator.IsValid(req.FBID, req.FBToken)
	if !isValid {
		json.NewEncoder(w).Encode(map[string]string{"error": "unauthorized"})
		return
	}
	user := s.db.GetUserFB(req.FBID)
	if user == nil {
		json.NewEncoder(w).Encode(map[string]string{"error": "internal error"})
		return
	}
	if !req.Payload.Valid() {
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid log id"})
		return
	}
	err := s.db.RemoveClimbingLog(user.ID, req.Payload)
	if user == nil {
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"result": "ok"})
	s.recentCache.TriggerUpdate()
}

func (s *Server) handleUserModify(w http.ResponseWriter, r *http.Request) {
	var req struct {
		FBID    string                 `json:"fb_id"`
		FBToken string                 `json:"fb_token"`
		Payload map[string]interface{} `json:"payload"`
	}
	json.NewDecoder(r.Body).Decode(&req)
	if req.FBID == "" || req.FBToken == "" {
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid request"})
		return
	}
	isValid := s.fbValidator.IsValid(req.FBID, req.FBToken)
	if !isValid {
		json.NewEncoder(w).Encode(map[string]string{"error": "unauthorized"})
		return
	}
	for k, _ := range req.Payload {
		if k != "category" {
			json.NewEncoder(w).Encode(map[string]string{"error": "invalid update; only updating category is supported"})
			return
		}
	}
	err := s.db.UpdateUserFB(req.FBID, req.Payload)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"result": "ok"})
	s.usersCache.TriggerUpdate()
}

func (s *Server) handleAdminUserModify(w http.ResponseWriter, r *http.Request) {
}

func (s *Server) handleAdminUserNew(w http.ResponseWriter, r *http.Request) {
}

func (s *Server) handleAdminLogApproveAll(w http.ResponseWriter, r *http.Request) {
	req := new(struct {
		FBID    string `json:"fb_id"`
		FBToken string `json:"fb_token"`
	})
	json.NewDecoder(r.Body).Decode(req)
	if !s.isAdmin(req.FBID, req.FBToken) {
		json.NewEncoder(w).Encode(map[string]string{"error": "not admin"})
		return
	}
	err := s.db.ApproveAll()
	if err != nil {
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}
	s.recentCache.TriggerUpdate()
	json.NewEncoder(w).Encode(map[string]string{"result": "ok"})
}

func (s *Server) handleAdminLogApprove(w http.ResponseWriter, r *http.Request) {
	req := new(struct {
		FBID    string        `json:"fb_id"`
		FBToken string        `json:"fb_token"`
		Payload bson.ObjectId `json:"payload"`
	})
	json.NewDecoder(r.Body).Decode(req)
	if !s.isAdmin(req.FBID, req.FBToken) {
		json.NewEncoder(w).Encode(map[string]string{"error": "not admin"})
		return
	}
	if !req.Payload.Valid() {
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid log id"})
		return
	}
	err := s.db.ApproveLog(req.Payload)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}
	s.recentCache.TriggerUpdate()
	json.NewEncoder(w).Encode(map[string]string{"result": "ok"})
}

func (s *Server) handleAdminLogDiscard(w http.ResponseWriter, r *http.Request) {
	req := new(struct {
		FBID    string        `json:"fb_id"`
		FBToken string        `json:"fb_token"`
		Payload bson.ObjectId `json:"payload"`
	})
	json.NewDecoder(r.Body).Decode(req)
	if !s.isAdmin(req.FBID, req.FBToken) {
		json.NewEncoder(w).Encode(map[string]string{"error": "not admin"})
		return
	}
	if !req.Payload.Valid() {
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid log id"})
		return
	}
	err := s.db.DiscardLog(req.Payload)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"result": "ok"})
}

func (s *Server) handleAdminRouteNew(w http.ResponseWriter, r *http.Request) {
	req := new(struct {
		FBID    string `json:"fb_id"`
		FBToken string `json:"fb_token"`
		Payload *Route `json:"payload"`
	})
	json.NewDecoder(r.Body).Decode(req)
	if !s.isAdmin(req.FBID, req.FBToken) {
		json.NewEncoder(w).Encode(map[string]string{"error": "not admin"})
		return
	}
	err := s.db.NewRoute(req.Payload)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}
	s.routesCache.TriggerUpdate()
	json.NewEncoder(w).Encode(map[string]string{"result": "ok"})
}

func (s *Server) handleAdminRouteEnable(w http.ResponseWriter, r *http.Request) {
	req := new(struct {
		FBID    string        `json:"fb_id"`
		FBToken string        `json:"fb_token"`
		Payload bson.ObjectId `json:"payload"`
	})
	json.NewDecoder(r.Body).Decode(req)
	if !s.isAdmin(req.FBID, req.FBToken) {
		json.NewEncoder(w).Encode(map[string]string{"error": "not admin"})
		return
	}
	if !req.Payload.Valid() {
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid log id"})
		return
	}
	err := s.db.EnableRoute(req.Payload)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"result": "ok"})
	s.routesCache.TriggerUpdate()
}

func (s *Server) handleAdminRouteDisable(w http.ResponseWriter, r *http.Request) {
	req := new(struct {
		FBID    string        `json:"fb_id"`
		FBToken string        `json:"fb_token"`
		Payload bson.ObjectId `json:"payload"`
	})
	json.NewDecoder(r.Body).Decode(req)
	if !s.isAdmin(req.FBID, req.FBToken) {
		json.NewEncoder(w).Encode(map[string]string{"error": "not admin"})
		return
	}
	if !req.Payload.Valid() {
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid log id"})
		return
	}
	err := s.db.DisableRoute(req.Payload)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"result": "ok"})
	s.routesCache.TriggerUpdate()
}
