/** @jsx React.DOM */

var React = require('react/addons');

var FloatingHead = require('./floating_head');
var Copyright = require('./copyright');
var ProgressRainbow = require('./progress_rainbow');

var C = require('../constants');

var numHeads = 10;

module.exports = React.createClass({
  getInitialState: function() {
    var climbers = [];
    for (var i = 0; i < numHeads; ++i) {
      var climber = {
        picture: "https://graph.facebook.com/839872286046811/picture?height=64",
        name: "Song Gao",
        logs: [],
      };
      var numLogs = Math.round(Math.random() * 58);
      for (var l = 0; l < numLogs; ++l) {
        var randomLog = Math.round(Math.random() * (C.Ratings.all.length - 1));
        climber.logs.push(randomLog)
      }
      climber.percentage = numLogs / 58;
      climbers.push(climber);
    }
    return { climbers: climbers, latestIndex: Math.round(Math.random() * numHeads) };
  },
  render: function() {
    var count = this.state.climbers.length;
    var heads = this.state.climbers.map(function(climber, index) {
      // 0 === latest; 1 == oldest
      var recentness = (this.state.latestIndex > index ? (this.state.latestIndex - index) : (this.state.latestIndex + numHeads - index)) / numHeads;
      return <FloatingHead picture={climber.picture} percentage={climber.percentage} pos={index/count} recentness={recentness} />;
    }.bind(this));
    var bars = [];
    var pushBar = function(climber) {
      bars.push(
        <ProgressRainbow name={climber.name} picture={climber.picture} percentage={climber.percentage} logs={climber.logs} />
      );
    }
    for (var i = this.state.latestIndex; i >= 0; --i) {
      pushBar(this.state.climbers[i]);
    }
    for (var i = numHeads - 1; i > this.state.latestIndex; --i) {
      pushBar(this.state.climbers[i]);
    }
    return (
      <div className="container-fluid fullheight">
        <div className="row el-cap fullheight">
          <div className="col-md-6 gradient fullheight no-scroll">
            <Copyright />
            {heads}
          </div>
          <div className="col-md-6 fullheight with-scroll">
            <h1> h1 </h1>
            <p> bahblah </p>
            {bars}
          </div>
        </div>
      </div>
    );
  }
});

