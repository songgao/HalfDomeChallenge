/** @jsx React.DOM */

var React = require('react');
var moment = require('moment')

var Log = require('./log');
var C = require('../constants');
var routesStore = require('../stores/routes');
var usersStore = require('../stores/users');

module.exports = React.createClass({
  _generateLogs: function() {
    if (!this.props.logs || !this.props.logs.length || !this.props.user) {
      return [];
    }
    var logs = this.props.logs.map(function(log, index) {
      var others = [];
      for (var i = 0; i < log.climbers.length; ++i) {
        if (log.climbers[i] !== this.props.user.id) {
          others.push(usersStore.findOrMissing(log.climbers[i]).name);
        }
      }
      var ret = {
        id: log.id,
        time: log.time,
        route: routesStore.findOrMissing(log.route),
        pending: log.pending,
        others: others
      };
      ret.royal = (ret.route.rating === C.Pitches[index]);
      return ret;
    }.bind(this));
    return logs;
  },
  render: function() {
    var logs = this._generateLogs().map(function(log) {
      return (<Log log={log} category={this.props.user.category} showRemove={false} absTime={true} />);
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
          {logs}
        </ul>
      </div>
    );
  }
});
