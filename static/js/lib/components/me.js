/** @jsx React.DOM */

var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var FloatingHead = require('./floating_head');
var Copyright = require('./copyright');
var Log = require('./log');
var NewLog = require('./new_log');
var MeInfo = require('./me_info');
var C = require('../constants');
var meStore = require('../stores/me');
var routesStore = require('../stores/routes');
var usersStore = require('../stores/users');

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
    console.log('me change');
    console.log(meStore.logs);
    this.setState({user: meStore.user, logs: this._generateLogs(meStore.logs, meStore.user)});
  },
  _onRoutesStoreChange: function() {
    console.log('routes change');
    this.setState({logs: this._generateLogs(meStore.logs)});
  },
  _onUsersStoreChange: function() {
    console.log('users change');
    this.setState({logs: this._generateLogs(meStore.logs)});
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
    this.setState(this.getInitialState());
  },
  render: function() {
    var climber = {
      picture: this.state.user ? (this.state.user.picture_url + "?height=64") : "",
      percentage: (this.state.logs ? this.state.logs.length : 0) / C.TotalPitches,
    };
    var logs = this.state.logs.map(function(log) {
      return (<Log log={log} />);
    });
    return (
      <div className="container-fluid fullheight">
        <div className="row el-cap fullheight">
          <div className="col-md-6 gradient fullheight">
              <Copyright />
              <FloatingHead picture={climber.picture} percentage={climber.percentage} />
          </div>
          <div className="col-md-6 fullheight with-scroll">
            <MeInfo user={this.state.user} logs={this.state.logs}/>
            <hr />
            <NewLog ref="newLog"/>
            <ul className="logs clearfix">
            <ReactCSSTransitionGroup transitionName="logs">
              {logs}
            </ReactCSSTransitionGroup>
            </ul>
          </div>
        </div>
      </div>
      );
  }
});

