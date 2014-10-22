/** @jsx React.DOM */

var React = require('react/addons');
var moment = require('moment');

var C = require('../constants');
var adminActions = require('../actions/admin_actions');

module.exports = React.createClass({
  _handleEnable: function() {
    adminActions.enableRoute(this.props.route);
  },
  _handleDisable: function() {
    adminActions.disableRoute(this.props.route);
  },
  render: function() {
    var tapeStyle = {
      "background-color": this.props.route.background_color,
      "border-color": this.props.route.color,
    };
    var ratingStyle = {
      "background-color": C.Rainbow(C.Ratings[this.props.route.rating] / (C.Ratings.all.length - 1)),
    };
    var natsStyle = {
      "background-color": C.Rainbow(this.props.route.nats / (C.Nats.all.length - 1)),
    };
    var ffStyle = {
      "background-color": C.Rainbow(this.props.route.ff ? 1 : 0),
    };
    var able, ableText;
    if (this.props.route.enabled) {
      able = (<a className="pointer admin-route-able" onClick={this._handleDisable}>disable</a>);
      ableText = "";
    } else {
      able = (<a className="pointer admin-route-able" onClick={this._handleEnable}>re-enable</a>);
      ableText = (<span className="label label-danger">disabled</span>);
    }

    return (
      <li className="admin-route clearfix">
        <div>
        <span className="badge" style={tapeStyle}></span>
        <span>&#34;{this.props.route.name}&#34;</span>
        <span> by {this.props.route.setter}</span>
        <span className="label" style={ratingStyle}>{this.props.route.rating}</span>
        <span className="label" style={ffStyle}>{this.props.route.ff ? "FF" : "AF"}</span>
        <span className="label" style={natsStyle}>{C.Nats.all[this.props.route.nats]}</span>
        {ableText}
        {able}
        </div>
      </li>
    )
  }
});
