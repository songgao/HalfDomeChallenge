var dispatcher = require('../dispatcher');
var C = require('../constants');

module.exports = {
  startFetching: function() {
    dispatcher.handleViewAction({
      type: C.ActionTypes.REPORT_FETCH,
    });
  },
};
