/** @jsx React.DOM */

var React = require('react');
var moment = require('moment');

var C = require('../constants');
var meActions = require('../actions/me_actions');

module.exports = React.createClass({
  _handleRemove: function() {
    meActions.removeLog(this.props.log);
  },
  render: function() {
    var ffStr, withStr;
    var categoryRainbow = C.Rainbow[this.props.category];
    if (!categoryRainbow) {
      categoryRainbow = C.Rainbow.Unknown;
    }
    var ratingStyle = {
      backgroundColor: categoryRainbow(C.Ratings[this.props.log.route.rating] / (C.Ratings.all.length - 1)),
    };
    var natsStyle = {
      backgroundColor: C.Rainbow.NATS_FF(this.props.log.route.nats / (C.Nats.all.length - 1)),
    };
    var ffStyle = {
      backgroundColor: C.Rainbow.NATS_FF(this.props.log.route.ff ? 1 : 0),
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
    var t;
    if (this.props.absTime) {
      t = moment(this.props.log.time).format('llll');
    } else {
      t = moment(this.props.log.time).fromNow();
    }
    return (
      <li className="log clearfix">
        <div>
        <span>{this.props.log.route.name}</span>
        {this.props.log.royal? <span className="label royal">Royal</span> : null }
        <span className="label" style={ffStyle}>{this.props.log.route.ff ? "FF" : "AF"}</span>
        <span className="label" style={natsStyle}>{C.Nats.all[this.props.log.route.nats]}</span>
        <span className="label" style={ratingStyle}>{this.props.log.route.rating}</span>
        <span className="pending">{this.props.log.pending?"pending":""}</span>
        </div>
        <div className="pull-right">
        <span className="with-who">{withStr}</span>
        <span className="rel-time">{t}</span>
        {removeLink}
        </div>
      </li>
    )
  }
});
