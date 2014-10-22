var EventEmitter = require('events').EventEmitter;
var util = require('util');
var dispatcher = require('../dispatcher');
var post = require('./authedPost');
var puller = require('./puller');
var C = require('../constants');
var meStore = require('./me');

function PendingLogs() {
  this.logs = [];

  dispatcher.register(function(payload) {
    if(payload.action.type === C.ActionTypes.ADMIN_PENDING_APPROVE) {
      this._approve(payload.action.log);
    } else if(payload.action.type === C.ActionTypes.ADMIN_PENDING_APPROVE_ALL) {
      this._approveAll();
    } else if(payload.action.type === C.ActionTypes.ADMIN_PENDING_DISCARD) {
      this._discard(payload.action.log);
    }
  }.bind(this));

  this._boundOnLogsPendingPull = this._onLogsPendingPull.bind(this);
  this._pulling = false;
  meStore.addChangeListener(this._onMeChange.bind(this));
  this._onMeChange();
}
util.inherits(PendingLogs, EventEmitter);

PendingLogs.prototype._onMeChange = function() {
  if (meStore.user && meStore.user.is_admin) {
    if (!this._pulling) {
      puller.pull('/api/logs/pending', this._boundOnLogsPendingPull);
      this._pulling = true;
      puller.now('/api/logs/pending', this._boundOnLogsPendingPull);
    }
  } else {
    if (this._pulling) {
      puller.removePull(this._boundOnLogsPendingPull);
      this._pulling = false;
    }
  }
};

PendingLogs.prototype._approve = function(log) {
  post('/api/admin/log/approve', log.id, function(err, data) {
    if (!err && data && !data.error) {
      puller.now('/api/logs/pending', this._boundOnLogsPendingPull);
    } else {
      console.log(data);
    }
  }.bind(this));
};

PendingLogs.prototype._approveAll = function() {
  post('/api/admin/log/approveAll', null, function(err, data) {
    if (!err && data && !data.error) {
      puller.now('/api/logs/pending', this._boundOnLogsPendingPull);
    } else {
      console.log(data);
    }
  }.bind(this));
};

PendingLogs.prototype._discard = function(log) {
  post('/api/admin/log/discard', log.id, function(err, data) {
    if (!err && data && !data.error) {
      puller.now('/api/logs/pending', this._boundOnLogsPendingPull);
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
