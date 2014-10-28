var EventEmitter = require('events').EventEmitter;
var util = require('util');
var async = require('async');

var dispatcher = require('../dispatcher');
var puller = require('./puller');
var C = require('../constants');
var meStore = require('./me');
var usersStore = require('./users');

var _REPORT_STATUS = {
  INIT     : "INIT",
  IDLE     : "IDLE",
  FETCHING : "FETCHING",
};

function Report() {
  this._state = null;
  this.context = {};
  this.latest = null;

  dispatcher.register(function(payload) {
    if( payload.action.type === C.ActionTypes.REPORT_FETCH &&
        this._state === _REPORT_STATUS.IDLE ) {
      this._changeState(_REPORT_STATUS.FETCHING);
    }
  }.bind(this));

  usersStore.addChangeListener(this._onDepStoreChange.bind(this));
  meStore.addChangeListener(this._onDepStoreChange.bind(this));

  this.on(_REPORT_STATUS.INIT, this._init.bind(this));
  this.on(_REPORT_STATUS.FETCHING, this._fetching.bind(this));

  this._changeState(_REPORT_STATUS.INIT);
}
util.inherits(Report, EventEmitter);

Report.prototype._changeState = function(to) {
  this._state = to;
  this.emit(to);
};

Report.prototype._init = function() {
  if (this.context.me && this.context.me.is_admin && this.context.users && this.context.users.length) {
    this._changeState(_REPORT_STATUS.IDLE);
  }
};

Report.prototype._onDepStoreChange = function() {
  this.context.users = usersStore.users;
  this.context.me = meStore.user;
  if (this._state === _REPORT_STATUS.FETCHING) {
    this.once(_REPORT_STATUS.IDLE, function() {
      this._changeState(_REPORT_STATUS.INIT);
    }.bind(this));
  } else {
    process.nextTick(function() {
      this._changeState(_REPORT_STATUS.INIT);
    }.bind(this));
  }
};

Report.prototype._fetching = function() {
  var users = this.context.users;
  var d = [];
  var count = 0;
  async.eachSeries(users, function(user, callback) {
    if (!user) {
      callback('null user');
      return;
    }
    puller.now('/api/user?id=' + user.id, function(err, data) {
      if (err) {
        callback(err);
        return;
      }
      if (!data) {
        callback('empty data returned');
        return
      }
      if (data.error) {
        callback(data.error);
        return
      }
      d.push(data);
      this.emit('progress', (++count) / users.length);
      callback(null);
    }.bind(this));
  }.bind(this), function(err) {
    if (!err) {
      this.latest = {
        finishedAt: new Date(),
        data: d
      };
    } else {
      this.latest = null;
    }
    this._changeState(_REPORT_STATUS.IDLE)
    this.emit('finish');
  }.bind(this));
};

Report.prototype.addProgressListener = function(callback) {
  this.on('progress', callback);
};

Report.prototype.removeProgressListener = function(callback) {
  this.removeListener('progress', callback);
};

Report.prototype.addFinishListener = function(callback) {
  this.on('finish', callback);
};

Report.prototype.removeFinishListener = function(callback) {
  this.removeListener('finish', callback);
};

module.exports = new Report();
