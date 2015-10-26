/** @jsx React.DOM */

var React = require('react');

var AdminPendingLog = require('./admin-pending-log');

var usersStore = require('../stores/users');
var routesStore = require('../stores/routes');
var pendingLogsStore = require('../stores/pending_logs');
var adminActions = require('../actions/admin_actions');

module.exports = React.createClass({
  getInitialState: function() {
    return {logs: this._generateLogs(pendingLogsStore.logs) }
  },
  _generateLogs: function(bareLogs) {
    if (!bareLogs || !bareLogs.length) {
      return [];
    }
    var logs = bareLogs.map(function(log) {
      return {
        id: log.id,
        time: log.time,
        route: routesStore.findOrMissing(log.route),
        pending: log.pending,
        climbers: log.climbers.map(function(climberId) {
          return usersStore.findOrMissing(climberId);
        }.bind(this)),
      };
    }.bind(this));
    return logs;
  },
  _onPendingLogsStoreChange: function() {
    this.setState({logs: this._generateLogs(pendingLogsStore.logs)});
  },
  _onRoutesStoreChange: function() {
    this.setState({logs: this._generateLogs(pendingLogsStore.logs)});
  },
  _onUsersStoreChange: function() {
    this.setState({logs: this._generateLogs(pendingLogsStore.logs)});
  },
  componentDidMount: function() {
    pendingLogsStore.addChangeListener(this._onPendingLogsStoreChange);
    routesStore.addChangeListener(this._onRoutesStoreChange);
    usersStore.addChangeListener(this._onUsersStoreChange);
  },
  componentWillUnmount: function() {
    pendingLogsStore.removeChangeListener(this._onPendingLogsStoreChange);
    routesStore.removeChangeListener(this._onRoutesStoreChange);
    usersStore.removeChangeListener(this._onUsersStoreChange);
  },
  _handleApproveAll: function() {
    adminActions.approveAll();
  },
  render: function() {
    var lis = this.state.logs.map(function(log) {
      return <AdminPendingLog route={log.route} climbers={log.climbers} log={log} />
    });
    return (
      <div>
        <div className="clearfix">
          <button className="btn btn-warning pull-right" onClick={this._handleApproveAll}>Approve All</button>
        </div>
        <ul className="pending-logs clearfix">
          {lis}
        </ul>
      </div>
    );
  }
});
