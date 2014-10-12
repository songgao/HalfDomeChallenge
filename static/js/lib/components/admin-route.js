/** @jsx React.DOM */

var React = require('react/addons');
var moment = require('moment');

var C = require('../constants');

module.exports = React.createClass({
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
    return (
      <li className="admin-route clearfix">
        <div>
        <span className="badge" style={tapeStyle}></span>
        <span>&#34;{this.props.route.name}&#34;</span>
        <span> by {this.props.route.setter}</span>
        <span className="label" style={ratingStyle}>{this.props.route.rating}</span>
        <span className="label" style={ffStyle}>{this.props.route.ff ? "FF" : "AF"}</span>
        <span className="label" style={natsStyle}>{C.Nats.all[this.props.route.nats]}</span>
        </div>
      </li>
    )
  }
});
