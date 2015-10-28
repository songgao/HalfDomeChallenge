/** @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="container-fluid home">
        <div className="row jumbotron">
          <div className="col-sm-12">
            <h2>Can you climb 40 pitches in two weeks?</h2>
            <p>Rising nearly 5,000 feet above Yosemite Valley, Half Dome is a Yosemite Icon. From Nov. 2-13, Auburn Outdoors hosts a Half Dome Challenge for students interested in climbing 2,000 feet -- the height of the Regular Northwest Face of Half Dome. To complete the free challenge, students must scale the climbing wall a total of 40 times during the two-week period. Climbers who complete the challenge will be recognized. Various prizes include a t-shirt.</p>
          </div>
        </div>
        <div className="row home-nav-links">
          <div className="col-sm-6 text-center">
            <a href="#me" className="btn btn-warning btn-lg" onClick={this._handleRecord}>Start Recording Your Pitches</a>
          </div>
          <div className="col-sm-6 text-center">
            <a href="#eagleseye" className="btn btn-primary btn-lg" onClick={this._handleSee}>See How Others Are Doing</a>
          </div>
        </div>
      </div>
    );
  }
});

