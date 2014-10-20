package main

import (
	"encoding/json"
	"fmt"
	"gopkg.in/mgo.v2/bson"
)

type CacheUpdater interface {
	Update(*DB) []byte
}

type UsersCacheUpdater int

func (c UsersCacheUpdater) Update(db *DB) []byte {
	users, err := db.Users()
	if err != nil {
		fmt.Println(err)
		return nil
	}
	ret, err := json.Marshal(users)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	return ret
}

type RecentCacheUpdater int

type recentItem struct {
	UserID   bson.ObjectId   `json:"user_id"`
	RouteIDs []bson.ObjectId `json:"route_ids"`
}

func (c RecentCacheUpdater) Update(db *DB) []byte {
	users, err := db.RecentlyUpdatedUsers(12)
	if err != nil {
		return nil
	}
	items := make([]recentItem, len(users))
	for index, user := range users {
		logs, err := db.ClimbingLogs(user.ID)
		if err != nil {
			continue
		}
		routeIDs := make([]bson.ObjectId, 0)
		for i := len(logs) - 1; i >= 0; i-- {
			if !logs[i].Pending {
				routeIDs = append(routeIDs, logs[i].Route)
			}
		}
		items[index] = recentItem{UserID: user.ID, RouteIDs: routeIDs}
	}
	ret, err := json.Marshal(items)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	return ret
}

type RoutesCacheUpdater int

func (c RoutesCacheUpdater) Update(db *DB) []byte {
	routes, err := db.Routes()
	if err != nil {
		fmt.Println(err)
		return nil
	}
	ret, err := json.Marshal(routes)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	return ret
}
