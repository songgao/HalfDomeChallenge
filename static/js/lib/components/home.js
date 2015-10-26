/** @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="container-fluid home">
        <div className="row jumbotron">
          <div className="col-sm-12">
            <h2>Can you climb 58 pitches in two weeks?</h2>
            <p>We challenge you to climb the equivalent vertical footage of El Capitan's famous nose route. You have two weeks to complete the climb. Challenge begins Oct. 22. Visit the wall to learn more.</p>
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

