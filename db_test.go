package main

import (
	"testing"
	"time"

	"gopkg.in/mgo.v2/bson"
)

func setup(t *testing.T) *DB {
	var err error
	db, err = ConnectDB("localhost", "elcap_auburn_go_test")
	if err != nil {
		t.Fatal(err)
	}
	err = db.master.Clone().DB(db.database).DropDatabase()
	if err != nil {
		t.Fatal(err)
	}
	return db
}

func cleanup(db *DB) {
	s := db.master.Clone()
	s.DB(db.database).DropDatabase()
	s.Close()
	db.master.Close()
}

var db *DB

func dummyUserInvalid() *User {
	user := new(User)
	user.Name = "Gopher"
	user.FBID = "fb_id_blah"
	user.Since = time.Now()
	user.Email = "gopher@example.com"
	user.PictureURL = "example.com"
	user.Category = "Advanced"
	return user
}

func dummyUserNonFB() *User {
	user := new(User)
	user.Name = "Gopher"
	user.Since = time.Now()
	user.Email = "gopher@example.com"
	user.PictureURL = "example.com"
	user.Category = "Advanced"
	return user
}

func dummyUserFB() *User {
	user := new(User)
	user.Name = "Gopher"
	user.FBID = "fb_id_blah"
	user.FBTokenSHA1 = "blahblah"
	user.Since = time.Now()
	user.Email = "gopher@example.com"
	user.PictureURL = "example.com"
	user.Category = "Advanced"
	return user
}

func TestNewUser(t *testing.T) {
	db := setup(t)
	defer cleanup(db)

	var (
		user *User
		err  error
	)

	user = dummyUserFB()
	err = db.NewUser(user)
	if err != nil {
		t.Fatalf("adding new FB user failed: %v\n", err)
	}
	err = db.NewUser(user)
	if err == nil {
		t.Fatalf("adding existed user succeeded. Expected to fail.\n")
	}

	user = dummyUserNonFB()
	err = db.NewUser(user)
	if err != nil {
		t.Fatalf("adding new Non FB user failed: %v\n", err)
	}

	user = dummyUserInvalid()
	err = db.NewUser(user)
	if err == nil {
		t.Fatalf("adding invalid user succeeded. Expected to fail.\n")
	}
}

func TestGetUserFB(t *testing.T) {
	db := setup(t)
	defer cleanup(db)

	var (
		user *User
		err  error
	)

	user = dummyUserFB()
	_, result := db.GetUserFB(user.FBTokenSHA1, user.FBID)
	if result == DB_FB_MATCH || result == DB_FB_ERR {
		t.Fatalf("non-legit user sneaked in or other error \n")
	}
	err = db.NewUser(user)
	if err != nil {
		t.Fatalf("adding new FB user failed: %v\n", err)
	}
	_, result = db.GetUserFB("fake sha1", user.FBID)
	if result != DB_FB_NOTMATCH {
		t.Fatalf("non-legit user sneaked in or other error \n")
	}
	user2, result := db.GetUserFB(user.FBTokenSHA1, user.FBID)
	if result != DB_FB_MATCH {
		t.Fatalf("legit user rejected or other error.\n")
	}
	if user.Name != user2.Name || user.Email != user2.Email ||
		user.PictureURL != user2.PictureURL || user.Category != user2.Category ||
		user.Since.Truncate(time.Second) != user2.Since.Truncate(time.Second) || user.FBTokenSHA1 != user2.FBTokenSHA1 ||
		user.FBID != user2.FBID {
		t.Fatalf("User returned by GetUserFB is inconsistent with the one inserted. \n%q\n%q\n", user, user2)
	}
}

func dummyRoute() *Route {
	route := new(Route)
	route.Name = "Hello World"
	route.Rating = "5.9"
	route.Setter = "Song Gao"
	route.FollowFeet = true
	route.NaturalFeatures = NatsON
	return route
}

func TestClimbingLog(t *testing.T) {
	db := setup(t)
	defer cleanup(db)

	route := dummyRoute()
	err := db.NewRoute(route)
	if err != nil {
		t.Fatalf("creating route error: %v\n", err)
	}

	user1 := dummyUserFB()
	user2 := dummyUserNonFB()
	err = db.NewUser(user1)
	if err != nil {
		t.Fatalf("creating user error: %v\n", err)
	}
	err = db.NewUser(user2)
	if err != nil {
		t.Fatalf("creating user error: %v\n", err)
	}

	log, err := db.NewClimbingLog(route.ID, []bson.ObjectId{user1.ID, user2.ID})
	if err != nil {
		t.Fatalf("creating climbing_logs error: %v\n", err)
	}
	logs, err := db.ClimbingLogs()
	if err != nil {
		t.Fatalf("creating climbing_logs error: %v\n", err)
	}
	if len(logs) != 1 || logs[0].Route != route.ID || len(logs[0].Climbers) != 2 {
		t.Fatalf("inserted climbing_logs seems wrong")
	}

	err = db.RemoveClimbingLog(bson.NewObjectId(), log.ID)
	if err == nil {
		t.Fatalf("removing log with invalid user ID succeeded. Expected error.")
	}
	err = db.RemoveClimbingLog(user1.ID, log.ID)
	if err != nil {
		t.Fatalf("removing log with legit user ID error: %v\n", err)
	}
	logs, err = db.ClimbingLogs()
	if err != nil {
		t.Fatalf("ruery climbing_logs error: %v\n", err)
	}
	if len(logs) != 0 {
		t.Fatalf("ClimbingLog still in DB. Expected: removed.")
	}
}
