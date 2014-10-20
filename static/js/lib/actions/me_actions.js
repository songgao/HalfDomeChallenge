var dispatcher = require('../dispatcher');
var C = require('../constants');

module.exports = {
  updateCategory: function(category) {
    dispatcher.handleViewAction({
      type: C.ActionTypes.ME_UPDATE_CATEGORY,
      category: category,
    });
  },
  newLog: function(route, partner) {
    dispatcher.handleViewAction({
      type: C.ActionTypes.ME_NEW_LOG,
      route: route,
      partner: partner,
    });
  },
  removeLog: function(log) {
    dispatcher.handleViewAction({
      type: C.ActionTypes.ME_REMOVE_LOG,
      log: log,
    });
  },
};
