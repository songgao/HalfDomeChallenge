var dispatcher = require('../dispatcher');
var C = require('../constants');

module.exports = {
  newRoute: function(route) {
    dispatcher.handleViewAction({
      type: C.ActionTypes.ADMIN_NEW_ROUTE,
      route: route,
    });
  },
  discardLog: function(log) {
    dispatcher.handleViewAction({
      type: C.ActionTypes.ADMIN_PENDING_DISCARD,
      log: log
    });
  },
  approveLog: function(log) {
    dispatcher.handleViewAction({
      type: C.ActionTypes.ADMIN_PENDING_APPROVE,
      log: log
    });
  },
  approveAll: function() {
    dispatcher.handleViewAction({
      type: C.ActionTypes.ADMIN_PENDING_APPROVE_ALL,
    });
  },
};
