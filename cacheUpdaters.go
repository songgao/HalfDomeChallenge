package main

import (
	"encoding/json"
	"fmt"
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

func (c RecentCacheUpdater) Update(db *DB) []byte {
	return nil
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
