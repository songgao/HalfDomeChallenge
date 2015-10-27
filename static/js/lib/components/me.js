/** @jsx React.DOM */

var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var FloatingHead = require('./floating_head');
var Copyright = require('./copyright');
var Log = require('./log');
var NewLog = require('./new_log');
var MeInfo = require('./me_info');
var C = require('../constants');
var meStore = require('../stores/me');
var routesStore = require('../stores/routes');
var usersStore = require('../stores/users');
var fbActions = require('../actions/fb_actions');

module.exports = React.createClass({
  getInitialState: function() {
    return {user: meStore.user, logs: this._generateLogs(meStore.logs) }
  },
  _generateLogs: function(bareLogs, user) {
    user = user || (this.state ? this.state.user : null);
    if (!bareLogs || !bareLogs.length || !user) {
      return [];
    }
    var logs = bareLogs.map(function(log) {
      var others = [];
      for (var i = 0; i < log.climbers.length; ++i) {
        if (log.climbers[i] !== user.id) {
          others.push(usersStore.findOrMissing(log.climbers[i]).name);
        }
      }
      return {
        id: log.id,
        time: log.time,
        route: routesStore.findOrMissing(log.route),
        pending: log.pending,
        others: others
      };
    }.bind(this));
    return logs;
  },
  _onMeStoreChange: function() {
    this.setState({user: meStore.user, logs: this._generateLogs(meStore.logs, meStore.user)});
  },
  _onRoutesStoreChange: function() {
    this.setState({logs: this._generateLogs(meStore.logs)});
  },
  _onUsersStoreChange: function() {
    this.setState({logs: this._generateLogs(meStore.logs)});
  },
  _handleLogin: function() {
    fbActions.loginButtonClick();
  },
  componentDidMount: function() {
    meStore.addChangeListener(this._onMeStoreChange);
    routesStore.addChangeListener(this._onRoutesStoreChange);
    usersStore.addChangeListener(this._onUsersStoreChange);
    this.setState(this.getInitialState());
  },
  componentWillUnmount: function() {
    meStore.removeChangeListener(this._onMeStoreChange);
    routesStore.removeChangeListener(this._onRoutesStoreChange);
    usersStore.removeChangeListener(this._onUsersStoreChange);
  },
  render: function() {
    if (!this.state.user) {
      return (
        <div className="container-fluid center">
          <h3 key="h3">Login to Start Record Your Pitches</h3>
          <button key="fb" onClick={this._handleLogin} type="button" className="btn btn-primary">Login with Facebook</button>
        </div>
      );
    }
    var climber = {
      picture: this.state.user ? (this.state.user.picture_url + "?height=64&width=64") : "",
      percentage: (this.state.logs ? this.state.logs.length : 0) / C.TotalPitches,
    };
    var logs = this.state.logs.map(function(log) {
      return (<Log key={log.id} log={log} category={this.state.user.category} showRemove={true}/>);
    }.bind(this));
    logs.reverse(); // so more recent pitches are displayed at top
    return (
      <div className="container-fluid fullheight">
        <div className="row el-cap fullheight">
          <div key="copyright" className="col-md-6 gradient fullheight no-scroll">
              <Copyright key="copyright"/>
              <FloatingHead key="head" picture={climber.picture} percentage={climber.percentage} />
          </div>
          <div key="main" className="col-md-6 fullheight with-scroll">
            <MeInfo key="me" user={this.state.user} logs={this.state.logs}/>
            <hr key="hr" />
            <NewLog key="new" ref="newLog"/>
            <ul key="logs" className="logs clearfix">
              {logs}
            </ul>
          </div>
        </div>
      </div>
      );
  }
});

