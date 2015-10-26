var EventEmitter = require('events').EventEmitter;
var util = require("util");
var dispatcher = require('../dispatcher');
var C = require('../constants');

var _FB_STATES = {
  INIT : "INIT",
  FB_LOADED : "FB_LOADED",
  FB_INITIALIZED : "FB_INITIALIZED",
  LOGGED_OUT : "LOGGED_OUT",
  LOGGED_IN : "LOGGED_IN",
  USER_PROFILE_ACQUIRED : "USER_PROFILE_ACQUIRED",
};

function FBLogin() {
  this.login_status = null;
  this.fb_profile = null;

  this._state = null;
  this.on(_FB_STATES.INIT, this._init.bind(this));
  this.on(_FB_STATES.FB_LOADED, this._fb_loaded.bind(this));
  this.on(_FB_STATES.LOGGED_OUT, this._logged_out.bind(this));
  this.on(_FB_STATES.LOGGED_IN, this._logged_in.bind(this));
  this.on(_FB_STATES.USER_PROFILE_ACQUIRED, this._user_profile_acquired.bind(this));

  dispatcher.register(function(payload) {
    if(payload.action.type === C.ActionTypes.FB_LOGIN_CLICK) {
      this.login(payload);
    } else if (payload.action.type === C.ActionTypes.FB_LOGOUT_CLICK) {
      this.logout(payload);
    }
  }.bind(this));
}
util.inherits(FBLogin, EventEmitter);

FBLogin.prototype._changeState = function(to) {
  this._state = to;
  this.emit(to);
};

FBLogin.prototype._init = function() {
  var self = this;

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '461372140719141',
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

FBLogin.prototype._onFBAuthChanged = function(response) {
  this.login_status = response;
  if(this.login_status.status === 'connected') {
    this._changeState(_FB_STATES.LOGGED_IN);
  } else {
    this._changeState(_FB_STATES.LOGGED_OUT);
  }
};

FBLogin.prototype._fb_loaded = function() {
  FB.Event.subscribe("auth.authResponseChanged", this._onFBAuthChanged.bind(this));
  FB.getLoginStatus(this._onFBAuthChanged.bind(this));
};

FBLogin.prototype._logged_out = function() {
  this.login_status = null;
  this.fb_profile = null;
  this.emit('fb_change');
};

FBLogin.prototype._logged_in = function() {
  FB.api('/me', function(response) {
    this.fb_profile = response;
    this._changeState(_FB_STATES.USER_PROFILE_ACQUIRED);
  }.bind(this));
};

FBLogin.prototype.logout = function() {
  if(this._state !== _FB_STATES.LOGGED_IN && this._state !== _FB_STATES.USER_PROFILE_ACQUIRED) {
    return;
  }
  FB.logout(function() {
    this._changeState(_FB_STATES.LOGGED_OUT)
  }.bind(this));
}

FBLogin.prototype.login = function() {
  if(this._state !== _FB_STATES.LOGGED_IN && this._state !== _FB_STATES.USER_PROFILE_ACQUIRED && this._state !== _FB_STATES.LOGGED_OUT) {
    return;
  }

  if(this._state === _FB_STATES.LOGGED_OUT) {
    FB.login(this._onFBAuthChanged.bind(this), {
      scope: 'public_profile,email',
    });
  } else { // in case already logged in, re-fetch user profile
    this._changeState(_FB_STATES.LOGGED_IN);
  }
};

FBLogin.prototype._user_profile_acquired = function() {
  this.emit('fb_change');
};

FBLogin.prototype.isLoggedIn = function() {
  return this._state === _FB_STATES.LOGGED_IN || this._state === _FB_STATES.USER_PROFILE_ACQUIRED
};

FBLogin.prototype.addChangeListener = function(callback) {
  this.on('fb_change', callback);
};

FBLogin.prototype.removeChangeListener = function(callback) {
  this.removeListener('fb_change', callback);
};

var fb_login = new FBLogin();

exports.fb_login = fb_login;
exports.FB_STATES = _FB_STATES;
fb_login._changeState(_FB_STATES.INIT);
