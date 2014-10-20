var dispatcher = require('../dispatcher');
var C = require('../constants');

module.exports = {
  selectUser: function(user) {
    dispatcher.handleViewAction({
      type: C.ActionTypes.PEEKER_SELECT_USER,
      user: user
    });
  },
};
