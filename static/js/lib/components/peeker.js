/** @jsx React.DOM */

var React = require('react');
var moment = require('moment');

var Log = require('./log');
var C = require('../constants');
var PersonPicker = require('./person_picker');
var routesStore = require('../stores/routes');
var usersStore = require('../stores/users');
var peekerStore = require('../stores/peeker');
var peekerActions = require('../actions/peeker_actions');

module.exports = React.createClass({
  getInitialState: function() {
    return {users: usersStore.users, user: peekerStore.user, logs: this._generateLogs(peekerStore.logs) }
  },
  _generateLogs: function() {
    var bareLogs = peekerStore.logs;
    var user = peekerStore.user;
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
  _onRoutesStoreChange: function() {
    this.setState({logs: this._generateLogs()});
  },
  _onUsersStoreChange: function() {
    this.setState({users: usersStore.users, logs: this._generateLogs()});
  },
  _onPeekerStoreChange: function() {
    this.setState({user: peekerStore.user, logs: this._generateLogs()});
  },
  componentDidMount: function() {
    routesStore.addChangeListener(this._onRoutesStoreChange);
    usersStore.addChangeListener(this._onUsersStoreChange);
    peekerStore.addChangeListener(this._onPeekerStoreChange);
    this.setState(this.getInitialState());
  },
  componentWillUnmount: function() {
    routesStore.removeChangeListener(this._onRoutesStoreChange);
    usersStore.removeChangeListener(this._onUsersStoreChange);
    peekerStore.removeChangeListener(this._onPeekerStoreChange);
  },
  _handleSelectPerson: function() {
    peekerActions.selectUser(this.refs.personPicker.state.selected);
  },
  render: function() {
    var personPicker = (
      <div className="row">
        <div className="col-sm-3"></div>
        <div className="col-sm-6">
          <PersonPicker ref="personPicker" onSelectChange={this._handleSelectPerson} />
        </div>
      </div>
    );
    if (!this.state.user) {
      return ( <div>{personPicker}</div> );
    }
    var climber = {
      picture: this.state.user ? (this.state.user.picture_url + "?height=64&width=64") : "",
      percentage: (this.state.logs ? this.state.logs.length : 0) / C.TotalPitches,
    };
    var logs = this.state.logs.map(function(log) {
      return (<Log log={log} showRemove={false} />);
    });
    var category;
    if(this.state.user.category === C.Categories[0]) {
      category = <span className="label label-success category-label">{this.state.user.category}</span>
    } else if(this.state.user.category === C.Categories[1]) {
      category = <span className="label label-warning category-label">{this.state.user.category}</span>
    } else if(this.state.user.category === C.Categories[2]) {
      category = <span className="label label-danger category-label">{this.state.user.category}</span>
    } else {
      category = (<div></div>);
    }
    var chips = this.state.logs.map(function(log) {
      var chipStyle = {
        backgroundColor: C.Rainbow(C.Ratings[log.route.rating] / (C.Ratings.all.length - 1)),
      }
      return <div className = "rainbow-chip" style={chipStyle}></div>;
    }.bind(this));
    return (
      <div className="container-fluid fullheight">
        {personPicker}
        <div>
          <h4>{this.state.user.name} {category}</h4>
          <div> Joined {moment(this.state.user.since).fromNow()} | Finished: {this.state.logs.length.toString() + ' / ' + C.TotalPitches.toString()}</div>
          <div className="me-info-chips">{chips}</div>
          <hr />
          <ul className="logs clearfix">
            {logs}
          </ul>
        </div>
      </div>
      );
  }
});

