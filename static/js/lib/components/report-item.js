/** @jsx React.DOM */

var React = require('react');
var moment = require('moment')

var utils = require('../utils');
var Log = require('./log');
var C = require('../constants');

module.exports = React.createClass({
  render: function() {
    var logs = utils.generateLogs(this.props.user, this.props.logs);
    var Logs = logs.map(function(log, index) {
      return (<Log logIndex={index} log={log} category={this.props.user.category} showRemove={false} absTime={true} />);
    }.bind(this));
    return (
      <div>
        <hr />
        <img src={this.props.user.picture_url + '?height=128&width=128'} className="pull-left img-circle" />
        <h4>{this.props.user.name}</h4>
        <div>Category: {this.props.user.category}</div>
        <div>Joined {moment(this.props.user.since).format('llll')}</div>
        <div>Finished: {logs.length.toString() + ' / ' + C.TotalPitches.toString() + ' (' + Math.round(logs.length / C.TotalPitches * 100).toString() + '%)'}</div>
        <ul className="logs clearfix">
          {Logs}
        </ul>
      </div>
    );
  }
});
