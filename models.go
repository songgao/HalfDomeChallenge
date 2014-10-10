package main

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

const (
	_ = iota
	NatsON
	NatsOFF
	NatsPartiallyON
)

type User struct {
	ID bson.ObjectId `bson:"_id"`

	Name       string    `bson:"name"`
	Email      string    `bson:"email"`
	PictureURL string    `bson:"picture_url"`
	Category   string    `bson:"category"`
	Since      time.Time `bson:"since"`

	FBTokenSHA1 string `bson:"fb_token_sha1,omitempty" json:"-"`
	FBID        string `bson:"fb_id,omitempty" json:"-"`
}

type ClimbingLog struct {
	ID bson.ObjectId `bson:"_id"`

	Time time.Time `bson:"time"`

	Route    bson.ObjectId   `bson:"route"`
	Climbers []bson.ObjectId `bson:"climbers"`
}

type Route struct {
	ID bson.ObjectId `bson:"_id"`

	Name            string `bson:"name"`
	Rating          string `bson:"rating"` // on of Ratings
	NaturalFeatures int    `bson:"nats"`   // NatsON, NatsOFF, NatsPartiallyON
	FollowFeet      bool   `bson:"ff"`
	Setter          string `bson:"setter"`
}

var Ratings = []string{
	"cupcake",
	"5.6-",
	"5.6",
	"5.6+",
	"5.7-",
	"5.7",
	"5.7+",
	"5.8-",
	"5.8",
	"5.8+",
	"5.9-",
	"5.9",
	"5.9+",
	"5.10-",
	"5.10",
	"5.10+",
	"5.11-",
	"5.11",
	"5.11+",
	"5.12-",
	"5.12",
	"5.12+",
	"5.13-",
	"5.13",
	"5.13+",
}
