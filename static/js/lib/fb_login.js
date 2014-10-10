var EventEmitter = require('events').EventEmitter;
var util = require("util");

var _FB_STATES = {
  INIT : "INIT",
  FB_LOADED : "FB_LOADED",
  FB_INITIALIZED : "FB_INITIALIZED",
  LOGGED_OUT : "LOGGED_OUT",
  LOGGED_IN : "LOGGED_IN",
  USER_PROFILE_ACQUIRED : "USER_PROFILE_ACQUIRED",
};

function FBLogin() {
  this.fb_status = null;
  this.fb_profile = null;

  this._state = null;
  this.on(_FB_STATES.INIT, this._init.bind(this));
  this.on(_FB_STATES.FB_LOADED, this._fb_loaded.bind(this));
  this.on(_FB_STATES.LOGGED_OUT, this._logged_out.bind(this));
  this.on(_FB_STATES.LOGGED_IN, this._logged_in.bind(this));
  this.on(_FB_STATES.USER_PROFILE_ACQUIRED, this._user_profile_acquired.bind(this));
}
util.inherits(FBLogin, EventEmitter);

FBLogin.prototype._changeState = function(to) {
  this._state = to;
  this.emit(to);
};

// returns true if it's ready, otherwise false. If not ready yet, cb will be
// emitted when it is.
FBLogin.prototype.ready = function(cb) {
  if (
    this._state === _FB_STATES.LOGGED_OUT ||
    this._state === _FB_STATES.LOGGED_IN ||
    this._state === _FB_STATES.USER_PROFILE_ACQUIRED
  ) {
    return true;
  } else {
    this.once('ready', cb);
    return false;
  }
}

FBLogin.prototype._init = function() {
  var self = this;

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '353718688129355',
      cookie     : true,
      xfbml      : false,
      version    : 'v2.1'
    });
    self._changeState(_FB_STATES.FB_LOADED);
  };

  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
};

FBLogin.prototype._fb_loaded = function() {
  var self = this;
  FB.getLoginStatus(function(response) {
    self.fb_status = response.status;
    if(self.fb_status === 'connected') {
      self._changeState(_FB_STATES.LOGGED_IN);
    } else {
      self._changeState(_FB_STATES.LOGGED_OUT);
    }
  });
};

FBLogin.prototype._logged_out = function() {
  this.emit('ready');
};

FBLogin.prototype._logged_in = function() {
  var self = this;
  FB.api('/me', function(response) {
    self.fb_profile = response;
    self._changeState(_FB_STATES.USER_PROFILE_ACQUIRED);
  });
};

FBLogin.prototype.login = function(callback) {
  var self = this;
  if(self._state !== _FB_STATES.LOGGED_IN && self._state !== _FB_STATES.USER_PROFILE_ACQUIRED && self._state !== _FB_STATES.LOGGED_OUT) {
    return;
  }

  self.once(_FB_STATES.USER_PROFILE_ACQUIRED, callback);

  if(self._state === _FB_STATES.LOGGED_OUT) {
    FB.login(function(response) {
      self.fb_status = response.status;
      if(self.fb_status === 'connected') {
        self._changeState(_FB_STATES.LOGGED_IN);
      }
    }, {
      scope: 'public_profile,email',
    });
  } else { // in case already logged in, re-fetch user profile
    self._changeState(_FB_STATES.LOGGED_IN);
  }
};

FBLogin.prototype._user_profile_acquired = function() {
  this.emit('ready');
};

var fb = new FBLogin();
exports.fb = fb;
fb._changeState(_FB_STATES.INIT);
