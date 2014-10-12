var Dispatcher = require('flux').Dispatcher;
var C = require('./constants');

var dispatcher = new Dispatcher();

dispatcher.handleServerAction = function(action) {
  var payload = {
    source: C.PayloadSources.SERVER_ACTION,
    action: action
  };
  this.dispatch(payload);
}.bind(dispatcher);

dispatcher.handleViewAction = function(action) {
  var payload = {
    source: C.PayloadSources.VIEW_ACTION,
    action: action
  };
  this.dispatch(payload);
}.bind(dispatcher)

module.exports = dispatcher;
