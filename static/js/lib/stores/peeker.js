var EventEmitter = require('events').EventEmitter;
var util = require('util');
var dispatcher = require('../dispatcher');
var fb_login = require('./fb_login').fb_login;
var puller = require('./puller');
var C = require('../constants');

function Peeker() {
  this.user = null;
  this.logs = [];

  dispatcher.register(function(payload) {
    if(payload.action.type === C.ActionTypes.PEEKER_SELECT_USER) {
      this._selectUser(payload.action.user);
    }
  }.bind(this));
}
util.inherits(Peeker, EventEmitter);

Peeker.prototype._selectUser = function(user) {
  puller.now('/api/user?id=' + user.id, this._onSelectUserPull.bind(this));
};

Peeker.prototype._setNull = function() {
  var change = false;
  if (this.user || this.logs.length) {
    change = true;
  }
  this.user = null;
  this.logs = [];
  if (change) {
    this.emit('change');
  }
}

Peeker.prototype._onSelectUserPull = function(err, data) {
  if (!data || data.error) {
    this._setNull();
    return;
  }
  this.user = data.user;
  this.logs = data.logs ? data.logs : [];
  this.emit('change');
};

Peeker.prototype.addChangeListener = function(callback) {
  this.on('change', callback);
};

Peeker.prototype.removeChangeListener = function(callback) {
  this.removeListener('change', callback);
};

module.exports = new Peeker();
