var dispatcher = require('../dispatcher');
var C = require('../constants');

module.exports = {
  loginButtonClick: function() {
    dispatcher.handleViewAction({
      type: C.ActionTypes.FB_LOGIN_CLICK,
    });
  },
  logoutButtonClick: function() {
    dispatcher.handleViewAction({
      type: C.ActionTypes.FB_LOGOUT_CLICK,
    });
  },
};
