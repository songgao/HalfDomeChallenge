/** @jsx React.DOM */

var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var C = require('../constants');
var AdminRoutesNew = require('./admin-routes-new');
var AdminRoute = require('./admin-route');
var routesStore = require('../stores/routes');

module.exports = React.createClass({
  getInitialState: function() {
    return {routes: routesStore.routes ? routesStore.routes : []};
  },
  _onRoutesChange: function() {
    this.setState({routes: routesStore.routes ? routesStore.routes : []});
  },
  componentDidMount: function() {
    routesStore.addChangeListener(this._onRoutesChange);
  },
  componentWillUnmount: function() {
    routesStore.removeChangeListener(this._onRoutesChange);
  },
  render: function() {
    var routes = this.state.routes.map(function(route) {
      return <AdminRoute route={route} />;
    });
    return (
      <div className='admin-routes-parent'>
        <AdminRoutesNew />
        <ul className="admin-routes">
        <ReactCSSTransitionGroup transitionName="adminRoutes">
          {routes}
        </ReactCSSTransitionGroup>
        </ul>
      </div>
    );
  }
});
