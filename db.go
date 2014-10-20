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
	err = cu.EnsureIndexKey("fb_id", "category", "_id", "updated_time")
	if err != nil {
		return
	}
	cr, sr := d.c("routes")
	defer sr.Close()
	err = cr.EnsureIndexKey("rating", "_id", "enabled")
	if err != nil {
		return
	}
	cc, sc := d.c("climbing_logs")
	defer sc.Close()
	err = cc.EnsureIndexKey("climbers", "route", "_id", "pending")
	return
}

func (d *DB) NewUser(user *User) error {
	c, s := d.c("users")
	defer s.Close()
	if user.FBID != "" {
		usr := new(User)
		err := c.Find(bson.M{"fb_id": user.FBID}).One(usr)
		if err != mgo.ErrNotFound {
			return errors.New("User with the same fb_id already exists")
		}
		user.ID = bson.NewObjectId()
		return c.Insert(user)
	} else {
		user.ID = bson.NewObjectId()
		return c.Insert(user)
	}
}

func (d *DB) UpdateUserFB(fbId string, payload map[string]interface{}) error {
	c, s := d.c("users")
	defer s.Close()
	return c.Update(bson.M{"fb_id": fbId}, bson.M{"$set": payload})
}

func (d *DB) UpdateUser(userID bson.ObjectId, payload map[string]interface{}) error {
	c, s := d.c("users")
	defer s.Close()
	return c.Update(bson.M{"_id": userID}, bson.M{"$set": payload})
}

func (d *DB) UpdateUserUpdatedTime(userID bson.ObjectId) error {
	c, s := d.c("users")
	defer s.Close()
	return c.Update(bson.M{"_id": userID}, bson.M{"$set": bson.M{"updated_time": time.Now()}})
}

func (d *DB) GetUser(userID bson.ObjectId) (user *User) {
	c, s := d.c("users")
	defer s.Close()
	user = new(User)
	err := c.Find(bson.M{"_id": userID}).One(user)
	if err == mgo.ErrNotFound {
		return nil
	}
	return user
}

func (d *DB) GetUserFB(fbId string) (user *User) {
	c, s := d.c("users")
	defer s.Close()
	user = new(User)
	err := c.Find(bson.M{"fb_id": fbId}).One(user)
	if err == mgo.ErrNotFound {
		return nil
	} else {
		return user
	}
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
	log := &ClimbingLog{ID: bson.NewObjectId(), Time: time.Now(), Route: route, Climbers: climbers, Pending: true}
	err := c.Insert(log)
	if err != nil {
		return nil, err
	}
	return log, nil
}

// TODO: only remove user rather than the entire log
func (d *DB) RemoveClimbingLog(user bson.ObjectId, climbingLog bson.ObjectId) error {
	c, s := d.c("climbing_logs")
	defer s.Close()
	err := c.Remove(bson.M{"_id": climbingLog, "climbers": user})
	return err
}

func (d *DB) DiscardLog(climbingLog bson.ObjectId) error {
	c, s := d.c("climbing_logs")
	defer s.Close()
	err := c.Remove(bson.M{"_id": climbingLog})
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

func (d *DB) ClimbingLogs(userID bson.ObjectId) (logs []ClimbingLog, err error) {
	c, s := d.c("climbing_logs")
	defer s.Close()
	err = c.Find(bson.M{"climbers": userID}).Sort("-time").All(&logs)
	return
}

func (d *DB) PendingLogs() (logs []ClimbingLog, err error) {
	c, s := d.c("climbing_logs")
	defer s.Close()
	err = c.Find(bson.M{"pending": true}).Sort("-time").All(&logs)
	return
}

func (d *DB) GetLog(logID bson.ObjectId) (log ClimbingLog, err error) {
	c, s := d.c("climbing_logs")
	defer s.Close()
	err = c.FindId(logID).One(&log)
	return
}

func (d *DB) ApproveLog(logID bson.ObjectId) error {
	c, s := d.c("climbing_logs")
	defer s.Close()
	return c.Update(bson.M{"_id": logID}, bson.M{"$set": bson.M{"pending": false}})
}

func (d *DB) RecentlyUpdatedUsers(count int) (users []User, err error) {
	c, s := d.c("users")
	defer s.Close()
	err = c.Find(bson.M{}).Sort("-updated_time").Limit(count).All(&users)
	return
}
