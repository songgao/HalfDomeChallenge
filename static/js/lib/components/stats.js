/** @jsx React.DOM */

var React = require('react/addons');

var FloatingHead = require('./floating_head');
var Copyright = require('./copyright');
var ProgressRainbow = require('./progress_rainbow');

var C = require('../constants');

var recentStore = require('../stores/recent');
var usersStore = require('../stores/users');
var routesStore = require('../stores/routes');

var numHeads = 12;

module.exports = React.createClass({
  getInitialState: function() {
    return {climbers: this._generateClimbers(recentStore.recent) }
  },
  _generateClimbers: function(recent) {
    if (!recent || !recent.length) {
      return [];
    }
    return recent.map(function(item) {
      var user = usersStore.findOrMissing(item.user_id);
      var logs;
      if (!item.route_ids || !item.route_ids.length) {
        logs = [];
      } else {
        logs = item.route_ids.map(function(route_id) {
          return C.Ratings[routesStore.findOrMissing(route_id).rating];
        }.bind(this));
      }
      return {
        picture: user.picture_url + "?height=64&width=64",
        name: user.name,
        logs: logs,
        percentage: logs.length / C.TotalPitches,
      }
    }.bind(this))
  },
  _onRecentStoreChange: function() {
    this.setState({climbers: this._generateClimbers(recentStore.recent)});
  },
  _onRoutesStoreChange: function() {
    this.setState({climbers: this._generateClimbers(recentStore.recent)});
  },
  _onUsersStoreChange: function() {
    this.setState({climbers: this._generateClimbers(recentStore.recent)});
  },
  componentDidMount: function() {
    recentStore.addChangeListener(this._onRecentStoreChange);
    routesStore.addChangeListener(this._onRoutesStoreChange);
    usersStore.addChangeListener(this._onUsersStoreChange);
  },
  componentWillUnmount: function() {
    recentStore.removeChangeListener(this._onRecentStoreChange);
    routesStore.removeChangeListener(this._onRoutesStoreChange);
    usersStore.removeChangeListener(this._onUsersStoreChange);
  },
  render: function() {
    var count = this.state.climbers.length;
    var heads = this.state.climbers.map(function(climber, index) {
      // 0 === latest; 1 == oldest
      var recentness = (this.state.latestIndex > index ? (this.state.latestIndex - index) : (this.state.latestIndex + numHeads - index)) / numHeads;
      return <FloatingHead picture={climber.picture} percentage={climber.percentage} pos={index/count} recentness={recentness} />;
    }.bind(this));
    var bars = this.state.climbers.map(function(climber) {
      if (!climber.logs || !climber.logs.length) {
        return <div></div>;
      }
      return <ProgressRainbow name={climber.name} picture={climber.picture} percentage={climber.percentage} logs={climber.logs} />
    }.bind(this))
    return (
      <div className="container-fluid fullheight">
        <div className="row el-cap fullheight stats-div">
          <div className="col-md-6 gradient fullheight no-scroll">
            <Copyright />
            {heads}
          </div>
          <div className="col-md-6 fullheight with-scroll">
            {bars}
          </div>
        </div>
      </div>
    );
  }
});

