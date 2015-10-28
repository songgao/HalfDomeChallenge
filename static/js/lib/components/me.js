/** @jsx React.DOM */

var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var utils = require('../utils');
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
    return {user: meStore.user}
  },
  _onMeStoreChange: function() {
    this.setState({user: meStore.user});
  },
  _onRoutesStoreChange: function() {
    this.forceUpdate();
  },
  _onUsersStoreChange: function() {
    this.forceUpdate();
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
    var logs = utils.generateLogs(this.state.user, meStore.logs);
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
      percentage: (logs ? logs.length : 0) / C.TotalPitches,
    };
    var Logs = logs.map(function(log) {
      return (<Log key={log.id} log={log} category={this.state.user.category} showRemove={true}/>);
    }.bind(this));
    Logs.reverse(); // so more recent pitches are displayed at top
    return (
      <div className="container-fluid fullheight">
        <div className="row el-cap fullheight">
          <div key="copyright" className="col-md-6 gradient fullheight no-scroll">
              <Copyright key="copyright"/>
              <FloatingHead key="head" picture={climber.picture} percentage={climber.percentage} />
          </div>
          <div key="main" className="col-md-6 fullheight with-scroll">
            <MeInfo key="me" user={this.state.user} logs={logs}/>
            <hr key="hr" />
            <NewLog key="new" ref="newLog"/>
            <ul key="logs" className="logs clearfix">
              {Logs}
            </ul>
          </div>
        </div>
      </div>
      );
  }
});

