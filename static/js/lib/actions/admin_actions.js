var dispatcher = require('../dispatcher');
var C = require('../constants');

module.exports = {
  newRoute: function(route) {
    dispatcher.handleViewAction({
      type: C.ActionTypes.ADMIN_NEW_ROUTE,
      route: route,
    });
  },
};
