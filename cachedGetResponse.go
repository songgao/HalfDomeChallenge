package main

import (
	"net/http"
	"sync"
)

// this limits us to run only one instance
type CachedGetResponse struct {
	response []byte
	mu       *sync.RWMutex
	updater  CacheUpdater
	db       *DB
}

func NewCachedGetReponse(db *DB, updater CacheUpdater) *CachedGetResponse {
	return &CachedGetResponse{db: db, mu: new(sync.RWMutex), updater: updater}
}

func (c *CachedGetResponse) TriggerUpdate() {
	go func() {
		c.mu.Lock()
		defer c.mu.Unlock()
		bytes := c.updater.Update(c.db)
		if bytes != nil {
			c.response = bytes
		}
	}()
}

func (c *CachedGetResponse) Respond(w http.ResponseWriter) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	w.Write(c.response)
}
