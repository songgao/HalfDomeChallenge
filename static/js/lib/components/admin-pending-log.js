/** @jsx React.DOM */

var React = require('react');
var moment = require('moment');

var C = require('../constants');
var actions = require('../actions/admin_actions');

module.exports = React.createClass({
  handleApprove: function() {
    actions.approveLog(this.props.log);
  },
  handleDiscard: function() {
    actions.discardLog(this.props.log);
  },
  render: function() {
    var people = this.props.climbers.map(function(person) {
      return (
        <span>
          <img src={person.picture_url + "?height=32&width=32"} className="img-circle"/>
          {person.name}
        </span>
      );
    }.bind(this));
    var routeStyle = {
      backgroundColor: this.props.route.background_color,
      color: this.props.route.color,
      padding: "4px 8px 4px 8px",
    };
    return (
      <li><div>
      <a className="pointer" onClick={this.handleApprove}>Approve</a>
      <a className="pointer" onClick={this.handleDiscard}>Discard</a>
      {people}
      <span style={routeStyle}>
      {this.props.route.setter} | {this.props.route.name} | {this.props.route.rating} | {this.props.route.ff ? "FF" : "AF"} | {C.Nats.all[this.props.route.nats]}
      </span>
      {moment(this.props.log.time).fromNow()} ({moment(this.props.log.time).format('llll')})
      </div></li>
    );
  }
});
