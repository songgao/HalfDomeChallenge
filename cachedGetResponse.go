package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"sync"
	"time"
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
	return &CachedGetResponse{db: db, mu: new(sync.RWMutex), updater: updater, version: 0}
}

func (c *CachedGetResponse) TriggerUpdate() {
	go func() {
		c.mu.Lock()
		defer c.mu.Unlock()
		c.version = time.Now().UTC().UnixNano() // not a problem until Jun 21, 2262
		bytes := c.updater.Update(c.db)
		if bytes == nil {
			fmt.Printf("updated returned nil %q\n", c.updater)
		}
		var err error
		c.response, err = json.Marshal(struct {
			Updated bool             `json:"updated"`
			Version string           `json:"version"`
			Data    *json.RawMessage `json:"data"`
		}{Updated: true, Version: strconv.FormatInt(c.version, 10), Data: bytes})
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
	fmt.Printf("version(unparsed): %s; version: %v; c.version: %v\n", r.URL.Query().Get("version"), version, c.version)
	if version < c.version {
		w.Write(c.response)
	} else {
		w.Write(_notUpdated)
	}
}
