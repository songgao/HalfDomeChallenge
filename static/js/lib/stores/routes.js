var EventEmitter = require('events').EventEmitter;
var util = require('util');
var dispatcher = require('../dispatcher');
var post = require('./authedPost');
var puller = require('./puller');
var C = require('../constants');

function Routes() {
  this.routes = [];

  this.setMaxListeners(16);

  dispatcher.register(function(payload) {
    if(payload.action.type === C.ActionTypes.ADMIN_NEW_ROUTE) {
      this._newRoute(payload.action.route);
    } else if(payload.action.type === C.ActionTypes.ADMIN_ROUTE_ENABLE) {
      this._enableRoute(payload.action.route);
    } else if(payload.action.type === C.ActionTypes.ADMIN_ROUTE_DISABLE) {
      this._disableRoute(payload.action.route);
    }
  }.bind(this));

  puller.pull('/api/routes', this._onRoutesPull.bind(this));
  puller.now('/api/routes', this._onRoutesPull.bind(this));
}
util.inherits(Routes, EventEmitter);

Routes.prototype.findOrMissing = function(id) {
  for(var i = 0; i < this.routes.length; ++i) {
    if(this.routes[i].id === id) {
      return this.routes[i];
    }
  }
  return {
    name: "Route information missing",
    rating: "cupcake",
    ff: false,
    nats: C.Nats.all[0],
    is_half: false,
    setter: 'unknown',
  };
};

Routes.prototype._newRoute = function(route) {
  post('/api/admin/route/new', route, function(err, data) {
    if (!err && data && !data.error) {
      puller.now('/api/routes', this._onRoutesPull.bind(this));
    }
  }.bind(this));
};

Routes.prototype._enableRoute = function(route) {
  post('/api/admin/route/enable', route.id, function(err, data) {
    if (!err && data && !data.error) {
      puller.now('/api/routes', this._onRoutesPull.bind(this));
    }
  }.bind(this));
};

Routes.prototype._disableRoute = function(route) {
  post('/api/admin/route/disable', route.id, function(err, data) {
    if (!err && data && !data.error) {
      puller.now('/api/routes', this._onRoutesPull.bind(this));
    }
  }.bind(this));
};

Routes.prototype._onRoutesPull = function(err, data) {
  if(!err) {
    this.routes = data ? data : [];
    this.emit('change');
  } else {
    console.log(err);
  }
};

Routes.prototype.addChangeListener = function(callback) {
  this.on('change', callback);
};

Routes.prototype.removeChangeListener = function(callback) {
  this.removeListener('change', callback);
};

module.exports = new Routes();
