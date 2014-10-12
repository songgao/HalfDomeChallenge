/** @jsx React.DOM */

var React = require('react/addons');

var moment = require('moment');

module.exports = React.createClass({
  render: function() {
    var people = this.props.users.map(function(person) {
      return (
        <span>
          <img src={person.picture_url + "?height=32"} className="img-circle"/>
          person.name
        </span>
      );
    }.bind(this));
    var routeStyle = {
      "background-color": route.background_color,
      "color": route.color,
      "padding": "4px 8px 4px 8px",
    };
    return (
      <li><div>
      <button className="btn btn-success">Approve</button>
      <button className="btn btn-danger">Discard</button>
      {people}
      <span style={routeStyle}>
      {this.props.route.setter} | {this.props.route.name} | {this.props.route.rating} | {this.props.route.ff ? "FF" : "AF"} | {C.Nats.all[this.props.route.nats]}
      </span>
      {moment(this.props.time).fromNow()}
      </div></li>
    );
  }
});
