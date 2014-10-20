var EventEmitter = require('events').EventEmitter;
var util = require('util');
var puller = require('./puller');
var C = require('../constants');

function Users() {
  this.users = [];

  puller.pull('/api/users', this._onUsersPull.bind(this));
  puller.now('/api/users', this._onUsersPull.bind(this));
}
util.inherits(Users, EventEmitter);

Users.prototype.findOrMissing = function(id) {
  for (var i = 0; i < this.users.length; ++i) {
    if (this.users[i].id === id) {
      return this.users[i];
    }
  }
  return {
    name: 'unknown',
    // add other fields as needed
  };
};

Users.prototype._onUsersPull = function(err, data) {
  if(!err) {
    this.users = data ? data : [];
    this.emit('change');
  } else {
    console.log(err);
  }
};

Users.prototype.addChangeListener = function(callback) {
  this.on('change', callback);
};

Users.prototype.removeChangeListener = function(callback) {
  this.removeListener('change', callback);
};

module.exports = new Users();
