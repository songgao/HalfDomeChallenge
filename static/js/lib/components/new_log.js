/** @jsx React.DOM */

var React = require('react');

var C = require('../constants');
var routesStore = require('../stores/routes');
var Selector = require('./selector');
var PersonPicker = require('./person_picker');
var actions = require('../actions/me_actions');

module.exports = React.createClass({
  getInitialState: function() {
    return {routes: routesStore.routes, route: null}
  },
  _onRoutesChange: function() {
    this.setState( {routes: routesStore.routes} );
  },
  _handleNewLog: function() {
    if (!this.state.route) {
      alert ("Please make sure you selected route");
      return
    }
    actions.newLog(this.state.route, this.refs.personPicker ? this.refs.personPicker.state.selected : null);
    $('#dialogNewLog').modal('hide');
  },
  _handleRouteOnSelect: function(e) {
    this.setState({route: e.selectedRef});
  },
  componentDidMount: function() {
    routesStore.addChangeListener(this._onRoutesChange);
  },
  componentWillUnmount: function() {
    routesStore.removeChangeListener(this._onRoutesChange);
  },
  render: function() {
    var routeOptions = [];
    if (this.state.routes && this.state.routes.length) {
      for (var i = 0; i < this.state.routes.length; ++i) {
        var route = this.state.routes[i];
        if (!route || !route.enabled) {
          continue;
        }
        var style = {
          backgroundColor: route.background_color,
          color: route.color,
          padding: "4px 8px 4px 8px",
        };
        routeOptions.push({
          dom: (
                <span style={style}>
                  {route.setter} | {route.name} | {route.is_half ? "Half" : "Full"} | {route.rating} | {route.ff ? "FF" : "AF"} | {C.Nats.all[route.nats]}
                </span>
               ),
          ref: route,
        });
      }
      routeOptions.sort(function(a, b) {
        return C.Ratings[a.ref.rating] - C.Ratings[b.ref.rating];
      });
    }
    var info_tip;
    if (this.state.route && this.state.route.is_half) {
      info_tip = (
          <div className="info-tip alert alert-warning" role="alert"><span className="glyphicon glyphicon-info-sign"></span>You have selected a route on one of the inside walls. Inside-wall routes count as half pitches. Remember to climb it twice before recording.</div>
          );
    } else {
      info_tip = (
          <div className="info-tip"><span className="glyphicon glyphicon-info-sign"></span>For routes on inside walls, you need to climb twice to count as one pitch.</div>
          );
    }
    return (
      <div className="clearfix">
        <button key="newpitch" type="button" className="btn btn-warning pull-right" data-toggle="modal" data-target="#dialogNewLog">New Pitch</button>
        <div key="modal" className="modal fade" id="dialogNewLog" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" ref="dialogNewLog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div key="header" className="modal-header">
                <button key="button" type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                <h4 key="h4" className="modal-title">Record a New Pitch</h4>
              </div>
              <div key="body" className="modal-body container-fluid">
                <form role="form">

                  <div key="route" className="form-group">
                    <label key="label">Route</label>
                    <div key="selector"><Selector options={routeOptions} selectedRef={this.state.route} ref="routeSelector" onSelect={this._handleRouteOnSelect} /></div>
                    {info_tip}
                  </div>
                  {/* Uncomment this to enable partners
                  <div key="partner" className="form-group">
                    <label key="label">Partner</label>
                    <PersonPicker key="picker" ref="personPicker"/>
                  </div>
                  */}

                </form>
              </div>
              <div key="footer" className="modal-footer">
                <div key="swear" className="swear-to-aubie">By clicking submit, I swear to Mr. Aubie that I did climb the route at Auburn University Recreation Center following the route specs.</div>
                <button key="close" type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                <button key="create" type="button" className="btn btn-primary" onClick={this._handleNewLog}>Create</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
});
