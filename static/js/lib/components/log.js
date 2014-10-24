/** @jsx React.DOM */

var React = require('react/addons');
var moment = require('moment');

var C = require('../constants');
var meActions = require('../actions/me_actions');

module.exports = React.createClass({
  _handleRemove: function() {
    meActions.removeLog(this.props.log);
  },
  render: function() {
    var ffStr, withStr;
    var ratingStyle = {
      "background-color": C.Rainbow(C.Ratings[this.props.log.route.rating] / (C.Ratings.all.length - 1)),
    };
    var natsStyle = {
      "background-color": C.Rainbow(this.props.log.route.nats / (C.Nats.all.length - 1)),
    };
    var ffStyle = {
      "background-color": C.Rainbow(this.props.log.route.ff ? 1 : 0),
    };
    if(this.props.log.others.length === 1) {
      withStr = " with " + this.props.log.others[0];
    } else if (this.props.log.others.length > 1) {
      var str = " with ";
      for (var i = 0; i < this.props.log.others.length - 1; ++i) {
        str += this.props.log.others[i] + ", ";
      }
      str += ", and " + this.props.log.others.length - 1;
    }
    var removeLink;
    if (this.props.showRemove) {
        removeLink = (<a className="pointer log-remove" onClick={this._handleRemove}>remove</a>);
    } else {
      removeLink = (<div></div>);
    }
    return (
      <li className="log clearfix">
        <div>
        <span>{this.props.log.route.name}</span>
        <span className="label" style={ffStyle}>{this.props.log.route.ff ? "FF" : "AF"}</span>
        <span className="label" style={natsStyle}>{C.Nats.all[this.props.log.route.nats]}</span>
        <span className="label" style={ratingStyle}>{this.props.log.route.rating}</span>
        <span className="pending">{this.props.log.pending?"pending":""}</span>
        </div>
        <div className="pull-right">
        <span className="with-who">{withStr}</span>
        <span className="rel-time">{moment(this.props.log.time).fromNow()}</span>
        {removeLink}
        </div>
      </li>
    )
  }
});
