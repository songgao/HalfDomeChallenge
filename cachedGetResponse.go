package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"sync"
)

var _notUpdated = []byte(`{"updated": false}`)

// this limits us to run only one instance
type CachedGetResponse struct {
	response []byte
	mu       *sync.RWMutex
	updater  CacheUpdater
	db       *DB
	version  int64
}

func NewCachedGetReponse(db *DB, updater CacheUpdater) *CachedGetResponse {
	return &CachedGetResponse{db: db, mu: new(sync.RWMutex), updater: updater, version: 1}
}

func (c *CachedGetResponse) TriggerUpdate() {
	go func() {
		c.mu.Lock()
		defer c.mu.Unlock()
		c.version++
		bytes := c.updater.Update(c.db)
		if bytes == nil {
			fmt.Printf("updated returned nil %q\n", c.updater)
		}
		var err error
		c.response, err = json.Marshal(struct {
			Updated bool             `json:"updated"`
			Version int64            `json:"version"`
			Data    *json.RawMessage `json:"data"`
		}{Updated: true, Version: c.version, Data: bytes})
		if err != nil {
			fmt.Printf("json marshal error %q\n", c.updater)
		}
	}()
}

func (c *CachedGetResponse) Respond(w http.ResponseWriter, r *http.Request) {
	version, err := strconv.ParseInt(r.URL.Query().Get("version"), 10, 64)
	if err != nil {
		version = 0
	}
	c.mu.RLock()
	defer c.mu.RUnlock()
	if version < c.version {
		w.Write(c.response)
	} else {
		w.Write(_notUpdated)
	}
}
