var EventEmitter = require('events').EventEmitter;
var util = require('util');
var dispatcher = require('../dispatcher');
var post = require('./authedPost');
var puller = require('./puller');
var C = require('../constants');

function Recent() {
  this.recent = [];

  puller.pull('/api/recent', this._onRecentPull.bind(this));
  puller.now('/api/recent', this._onRecentPull.bind(this));
}
util.inherits(Recent, EventEmitter);

Recent.prototype._onRecentPull = function(err, data) {
  if(!err) {
    this.recent = data ? data : [];
    this.emit('change');
  } else {
    console.log(err);
  }
};

Recent.prototype.addChangeListener = function(callback) {
  this.on('change', callback);
};

Recent.prototype.removeChangeListener = function(callback) {
  this.removeListener('change', callback);
};

module.exports = new Recent();
