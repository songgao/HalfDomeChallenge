package main

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

const (
	_ = iota
	NatsON
	NatsPartiallyON
	NatsOFF
)

type User struct {
	ID bson.ObjectId `bson:"_id" json:"id"`

	Name       string    `bson:"name" json:"name"`
	Email      string    `bson:"email" json:"email"`
	PictureURL string    `bson:"picture_url" json:"picture_url"`
	Category   string    `bson:"category" json:"category"`
	Since      time.Time `bson:"since" json:"since"`
	Admin      bool      `bson:"is_admin" json:"is_admin"`
	Updated    time.Time `bson:"updated_time" json:"updated_time"`

	FBID string `bson:"fb_id,omitempty" json:"-"`
}

type ClimbingLog struct {
	ID bson.ObjectId `bson:"_id" json:"id"`

	Time time.Time `bson:"time" json:"time"`

	Route    bson.ObjectId   `bson:"route" json:"route"`
	Climbers []bson.ObjectId `bson:"climbers" json:"climbers"`

	Pending bool `bson:"pending" json:"pending"`
}

type Route struct {
	ID bson.ObjectId `bson:"_id" json:"id"`

	Name            string `bson:"name" json:"name"`
	Rating          string `bson:"rating" json:"rating"` // on of Ratings
	NaturalFeatures int    `bson:"nats" json:"nats"`     // NatsON, NatsOFF, NatsPartiallyON
	FollowFeet      bool   `bson:"ff" json:"ff"`
	Setter          string `bson:"setter" json:"setter"`

	BackgroundColor string `bson:"background_color" json:"background_color"`
	Color           string `bson:"color" json:"color"`

	Enabled bool `bson:"enabled" json:"enabled"`
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
