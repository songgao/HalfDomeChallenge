package main

import (
	"errors"

	"time"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type DB struct {
	master   *mgo.Session
	database string
}

func ConnectDB(url string, db string) (*DB, error) {
	master, err := mgo.Dial(url)
	if err != nil {
		return nil, err
	}
	master.SetSafe(new(mgo.Safe))
	ret := &DB{master: master, database: db}
	err = ret.ensureIndex()
	if err != nil {
		return nil, err
	}
	return ret, nil
}

func (d *DB) c(name string) (*mgo.Collection, *mgo.Session) {
	session := d.master.Clone()
	return session.DB(d.database).C(name), session
}

func (d *DB) ensureIndex() (err error) {
	cu, su := d.c("users")
	defer su.Close()
	err = cu.EnsureIndexKey("fb_id", "name", "email", "category", "_id")
	if err != nil {
		return
	}
	cr, sr := d.c("routes")
	defer sr.Close()
	err = cr.EnsureIndexKey("rating", "_id")
	if err != nil {
		return
	}
	cc, sc := d.c("climbing_logs")
	defer sc.Close()
	err = cc.EnsureIndexKey("climbers", "route", "_id")
	return
}

func (d *DB) NewUser(user *User) error {
	c, s := d.c("users")
	defer s.Close()
	if user.FBTokenSHA1 != "" && user.FBID != "" {
		usr := new(User)
		err := c.Find(bson.M{"fb_id": user.FBID}).One(usr)
		if err != mgo.ErrNotFound {
			return errors.New("User with the same fb_id already exists")
		}
		user.ID = bson.NewObjectId()
		return c.Insert(user)
	} else if user.FBTokenSHA1 == "" && user.FBID == "" {
		user.ID = bson.NewObjectId()
		return c.Insert(user)
	} else {
		return errors.New("Invalid user object")
	}
}

func (d *DB) GetUserFB(tokenSHA1 string, fbId string) (user *User, legit bool) {
	c, s := d.c("users")
	defer s.Close()
	user = new(User)
	err := c.Find(bson.M{"fb_id": fbId}).One(user)
	if err != nil || user.FBTokenSHA1 != tokenSHA1 {
		return nil, false
	}
	return user, true
}

func (d *DB) NewRoute(route *Route) error {
	c, s := d.c("routes")
	defer s.Close()
	route.ID = bson.NewObjectId()
	return c.Insert(route)
}

func (d *DB) NewClimbingLog(route bson.ObjectId, climbers []bson.ObjectId) (*ClimbingLog, error) {
	c, s := d.c("climbing_logs")
	defer s.Close()
	log := &ClimbingLog{ID: bson.NewObjectId(), Time: time.Now(), Route: route, Climbers: climbers}
	err := c.Insert(log)
	if err != nil {
		return nil, err
	}
	return log, nil
}

func (d *DB) RemoveClimbingLog(user bson.ObjectId, climbingLog bson.ObjectId) error {
	c, s := d.c("climbing_logs")
	defer s.Close()
	err := c.Remove(bson.M{"_id": climbingLog, "climbers": user})
	return err
}

func (d *DB) Users() (users []User, err error) {
	c, s := d.c("users")
	defer s.Close()
	err = c.Find(nil).All(&users)
	return
}

func (d *DB) Routes() (routes []Route, err error) {
	c, s := d.c("routes")
	defer s.Close()
	err = c.Find(nil).All(&routes)
	return
}

func (d *DB) ClimbingLogs() (logs []ClimbingLog, err error) {
	c, s := d.c("climbing_logs")
	defer s.Close()
	err = c.Find(nil).All(&logs)
	return
}
