var EventEmitter = require('events').EventEmitter;
var util = require('util');
var dispatcher = require('../dispatcher');
var post = require('./authedPost');
var puller = require('./puller');
var C = require('../constants');

function PendingLogs() {
  this.logs = [];

  dispatcher.register(function(payload) {
    if(payload.action.type === C.ActionTypes.ADMIN_PENDING_APPROVE) {
      this._approve(payload.action.log);
    } else if(payload.action.type === C.ActionTypes.ADMIN_PENDING_DISCARD) {
      this._discard(payload.action.log);
    }
  }.bind(this));

  puller.pull('/api/logs/pending', this._onLogsPendingPull.bind(this));
  puller.now('/api/logs/pending', this._onLogsPendingPull.bind(this));
}
util.inherits(PendingLogs, EventEmitter);

PendingLogs.prototype._approve = function(log) {
  post('/api/admin/log/approve', log.id, function(err, data) {
    if (!err && data && !data.error) {
      puller.now('/api/logs/pending', this._onLogsPendingPull.bind(this));
    } else {
      console.log(data);
    }
  }.bind(this));
};

PendingLogs.prototype._discard = function(log) {
  post('/api/admin/log/discard', log.id, function(err, data) {
    if (!err && data && !data.error) {
      puller.now('/api/logs/pending', this._onLogsPendingPull.bind(this));
    } else {
      console.log(data);
    }
  }.bind(this));
};

PendingLogs.prototype._onLogsPendingPull = function(err, data) {
  if(!err) {
    this.logs = data ? data : [];
    this.emit('change');
  } else {
    console.log(err);
  }
};

PendingLogs.prototype.addChangeListener = function(callback) {
  this.on('change', callback);
};

PendingLogs.prototype.removeChangeListener = function(callback) {
  this.removeListener('change', callback);
};

module.exports = new PendingLogs();
