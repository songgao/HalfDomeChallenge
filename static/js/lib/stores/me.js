var EventEmitter = require('events').EventEmitter;
var util = require('util');
var dispatcher = require('../dispatcher');
var fb_login = require('./fb_login').fb_login;
var post = require('./authedPost');
var puller = require('./puller');
var C = require('../constants');

function Me() {
  this.user = null;
  this.logs = [];

  dispatcher.register(function(payload) {
    if(payload.action.type === C.ActionTypes.ME_UPDATE_CATEGORY) {
      this._updateCategory(payload.action.category);
    } else if (payload.action.type === C.ActionTypes.ME_NEW_LOG) {
      this._newLog(payload.action.route, payload.action.partner);
    } else if (payload.action.type === C.ActionTypes.ME_REMOVE_LOG) {
      this._removeLog(payload.action.log);
    }
  }.bind(this));

  this._boundOnUserPull = this._onUserPull.bind(this);
  this._pulling = false;
  fb_login.addChangeListener(this._onFbChange.bind(this));
}
util.inherits(Me, EventEmitter);

Me.prototype._removeLog = function(log) {
  if(!this.user) {
    return
  }
  post('/api/log/remove', log.id, function(err, data) {
    if (!err && data && !data.error) {
      puller.now('/api/user?id=' + this.user.id, this._boundOnUserPull);
    } else {
      console.log(data);
    }
  }.bind(this));
};

Me.prototype._newLog = function(route, partner) {
  if(!this.user) {
    return
  }
  post('/api/log/new', {
    "route_id": route.id,
    "climbers_id": partner ? [this.user.id, partner.id] : [this.user.id],
  }, function(err, data) {
    if (!err && data && !data.error) {
      puller.now('/api/user?id=' + this.user.id, function(err, data) {
        this._onUserPull(err, data);
        if (this.logs.length === C.TotalPitches) {
          // this has to happen here, only right after submitting new log
          this.emit('finish');
        }
      }.bind(this));
    } else {
      console.log(data);
    }
  }.bind(this));
};

Me.prototype._onFbChange = function() {
  if(fb_login.isLoggedIn()) {
    this._fetchUserData();
  } else {
    this._setNull();
  }
};

Me.prototype._setNull = function() {
  var change = false;
  if (this.user || this.logs.length) {
    change = true;
  }
  this.user = null;
  this.logs = [];
  if (change) {
    this.emit('change');
  }
  if (this._pulling) {
    puller.removePull(this._boundOnUserPull);
    this._pulling = false;
  }
}

Me.prototype._fetchUserData = function() {
  post("/api/auth", null, function(err, data) {
    if (err || !data || data.error) {
      console.log(data);
      this._setNull();
      return;
    }
    if (!this._pulling) {
      puller.pull('/api/user?id=' + data.user_id, this._boundOnUserPull);
      this._pulling = true;
      puller.now('/api/user?id=' + data.user_id, this._boundOnUserPull);
    }
  }.bind(this));
};

Me.prototype._onUserPull = function(err, data) {
  if (!data || data.error) {
    this._setNull();
    return;
  }
  this.user = data.user;
  this.logs = data.logs ? data.logs : [];
  this.emit('change');
};

Me.prototype._updateCategory = function(updated) {
  post('/api/user/modify', {'category': updated}, function(err, data) {
    if (!err && data && data.result === 'ok') {
      puller.now('/api/user?id=' + this.user.id, this._boundOnUserPull);
    }
  }.bind(this));
};

Me.prototype.addChangeListener = function(callback) {
  this.on('change', callback);
};

Me.prototype.removeChangeListener = function(callback) {
  this.removeListener('change', callback);
};

Me.prototype.addFinishListener = function(callback) {
  this.on('finish', callback);
};

Me.prototype.removeFinishListener = function(callback) {
  this.removeListener('finish', callback);
};

module.exports = new Me();
