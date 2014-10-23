var async = require('async');

function Puller() {
  this._cbs = [];
  this._intervalID = null;
  this.versions = {};

  this._intervalID = window.setInterval(this._onPull.bind(this), 7000); // 7 seconds
}

Puller.prototype._onPull = function() {
  var cbs = [];
  this._cbs.forEach(function(cb) { cbs.push(cb); });
  async.each(cbs, function(item, callback) {
    this.now(item.uri, item.cb);
    callback();
  }.bind(this));
};

Puller.prototype.now = function(uri, callback) {
    var url = uri;
    if (this.versions[uri] && this.versions[uri] >= 0) {
      if (url.indexOf("?") > -1) {
        url += "&version=";
      } else {
        url += "?version=";
      }
      url += this.versions[uri].toString();
    }
    $.ajax({
      url:      url,
      type:     'GET',
      dataType: 'json',
    }).done(function(payload){
      if (payload.updated) {
        this.versions[uri] = payload.version || -1 ;
        callback(null, payload.data);
      }
    }.bind(this)).fail(function(_, _, err) {
      callback(err);
    });
};

Puller.prototype.pull = function(uri, callback) {
  this._cbs.push({uri: uri, cb: callback});
};

Puller.prototype.removePull = function(callback) {
  var ind = -1;
  for (var i = 0; i < this._cbs.length; ++i) {
    if (this._cbs[i].cb == callback) {
      ind = i;
      break;
    }
  }
  if (ind !== -1) {
    this._cbs.splice(ind, 1);
  }
};

module.exports = new Puller();
