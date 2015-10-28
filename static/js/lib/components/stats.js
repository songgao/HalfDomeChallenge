/** @jsx React.DOM */

var React = require('react');

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
      var logRatings;
      if (!item.route_ids || !item.route_ids.length) {
        logRatings = [];
      } else {
        logRatings = item.route_ids.map(function(route_id) {
          return routesStore.findOrMissing(route_id).rating;
        }.bind(this));
      }
      return {
        picture: user.picture_url + "?height=64&width=64",
        name: user.name,
        category: user.category,
        logRatings: logRatings,
        id: user.id,
        percentage: logRatings.length / C.TotalPitches,
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
    var heads = !count ? [] : this.state.climbers.map(function(climber, index) {
      if (!climber || !climber.id) {
        return <div key={index}></div>
      }
      // 0 === latest; 1 == oldest
      var recentness = index / (count - 1);
      return <FloatingHead key={climber.id} picture={climber.picture} percentage={climber.percentage} pos={index/count} recentness={recentness} />;
    }.bind(this));
    heads.reverse(); // so that newer ones don't get covered by older ones
    var bars = this.state.climbers.map(function(climber, index) {
      if (!climber.id || !climber.logRatings || !climber.logRatings.length) {
        return <div key={index}></div>;
      }
      return <ProgressRainbow key={climber.id} name={climber.name} picture={climber.picture} percentage={climber.percentage} logRatings={climber.logRatings} category={climber.category} />
    }.bind(this))
    return (
      <div className="container-fluid fullheight">
        <div className="row el-cap fullheight stats-div">
          <div key="left" className="col-md-6 gradient fullheight no-scroll">
            <Copyright key="copyright" />
            {heads}
          </div>
          <div key="bars" className="col-md-6 fullheight with-scroll">
            {bars}
          </div>
        </div>
      </div>
    );
  }
});

