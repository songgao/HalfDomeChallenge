var EventEmitter = require('events').EventEmitter;
var util = require('util');

var fb_login = require('./fb_login').fb_login;

function AuthedPost() {
  this.fbId = null;
  this.fbToken = null;

  fb_login.addChangeListener(this._onFbChange.bind(this));
  this._onFbChange() // incase fbLogin was initialized before this
}
util.inherits(AuthedPost, EventEmitter);

AuthedPost.prototype._onFbChange = function() {
  if(fb_login.isLoggedIn()) {
    this.fbId = fb_login.fb_profile.id;
    this.fbToken = fb_login.login_status.authResponse.accessToken;
    this.emit('fb_logged_in')
  } else {
    this.fbId = null;
    this.fbToken = null;
  }
}

AuthedPost.prototype.post = function(url, data, cb) {
  var fn = function() {
    $.ajax({
      type: "POST",
      url: url,
      data: JSON.stringify({
        "fb_id": this.fbId,
        "fb_token": this.fbToken,
        "payload": data
      }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
    }).done(function(data) {
      cb(null, data);
    }).fail(function(_, _, err) {
      cb(err);
    });
  }.bind(this);

  if (this.fbToken && this.fbId) {
    process.nextTick(fn);
  } else {
    this.once("fb_logged_in", fn);
  }
};

var poster = new AuthedPost();
module.exports = poster.post.bind(poster);
