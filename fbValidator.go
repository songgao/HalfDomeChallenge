package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"
)

type fbTokenDebuggerResponse struct {
	Data struct {
		AppID       string   `json:"app_id"`
		IsValid     bool     `json:"is_valid"`
		Application string   `json:"application"`
		UserID      string   `json:"user_id"`
		ExpiresAt   int64    `json:"expires_at"`
		Scopes      []string `json:"scopes"`
	} `json:"data"`
}

type FBTokenCache struct {
	FBID      string
	ExpiresAt time.Time
}

type FBValidator struct {
	tokens   map[string]FBTokenCache // token -> FBTokenCache
	appToken string
	mu       *sync.RWMutex
}

func NewFBValidator(config *Config) *FBValidator {
	return &FBValidator{tokens: make(map[string]FBTokenCache), appToken: config.fbToken, mu: new(sync.RWMutex)}
}

func (v *FBValidator) IsValid(FBID string, FBToken string) bool {
	v.mu.RLock()
	t, ok := v.tokens[FBToken]
	v.mu.RUnlock()
	if ok && t.ExpiresAt.After(time.Now()) {
		if t.FBID == FBID {
			return true
		} else {
			return false
		}
	}

	v.updateTokenCache(FBToken)

	v.mu.RLock()
	t, ok = v.tokens[FBToken]
	v.mu.RUnlock()
	if ok && t.ExpiresAt.After(time.Now()) {
		if t.FBID == FBID {
			return true
		} else {
			return false
		}
	}

	return false
}

func (v *FBValidator) updateTokenCache(FBToken string) {
	v.mu.Lock()
	defer v.mu.Unlock()
	response, err := http.Get(fmt.Sprintf("https://graph.facebook.com/debug_token?input_token=%s&access_token=%s", FBToken, v.appToken))
	if err != nil {
		delete(v.tokens, FBToken)
		return
	}
	var resp fbTokenDebuggerResponse
	if nil != json.NewDecoder(response.Body).Decode(&resp) {
		delete(v.tokens, FBToken)
		return
	}
	if !resp.Data.IsValid {
		delete(v.tokens, FBToken)
		return
	}
	v.tokens[FBToken] = FBTokenCache{FBID: resp.Data.UserID, ExpiresAt: time.Unix(resp.Data.ExpiresAt, 0)}
}

func (v *FBValidator) gc() {
	for {
		time.Sleep(200 * time.Second)
		v.mu.Lock()
		toCollect := make([]string, 0)
		for k, t := range v.tokens {
			if t.ExpiresAt.After(time.Now()) {
				toCollect = append(toCollect, k)
			}
		}
		for _, k := range toCollect {
			delete(v.tokens, k)
		}
		v.mu.Unlock()
	}
}
