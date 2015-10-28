/** @jsx React.DOM */

var React = require('react');
var moment = require('moment');

var Log = require('./log');
var C = require('../constants');
var utils = require('../utils');
var PersonPicker = require('./person_picker');
var peekerStore = require('../stores/peeker');
var peekerActions = require('../actions/peeker_actions');
var Chips = require('./chips');

module.exports = React.createClass({
  getInitialState: function() {
    return {user: peekerStore.user}
  },
  _onPeekerStoreChange: function() {
    this.setState({user: peekerStore.user});
  },
  componentDidMount: function() {
    peekerStore.addChangeListener(this._onPeekerStoreChange);
  },
  componentWillUnmount: function() {
    peekerStore.removeChangeListener(this._onPeekerStoreChange);
  },
  _handleSelectPerson: function() {
    peekerActions.selectUser(this.refs.personPicker.state.selected);
  },
  render: function() {
    var logs = utils.generateLogs(this.state.user, peekerStore.logs);
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
      percentage: (logs ? logs.length : 0) / C.TotalPitches,
    };
    var Logs = logs.map(function(log) {
      return (<Log log={log} category={this.state.user.category} showRemove={false} />);
    }.bind(this));
    Logs.reverse();
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
    var logRatings = [];
    if (logs && logs.length) {
      logRatings = logs.map(function(log) {
        return log.route.rating;
      });
    }

    return (
      <div className="container-fluid fullheight">
        {personPicker}
        <div>
          <h4>{this.state.user.name} {category}</h4>
          <div> Joined {moment(this.state.user.since).fromNow()} | Finished: {logs.length.toString() + ' / ' + C.TotalPitches.toString()}</div>
          <Chips className="me-info-chips" category={this.state.user.category} logRatings={logRatings} />
          <hr />
          <ul className="logs clearfix">
            {Logs}
          </ul>
        </div>
      </div>
      );
  }
});

