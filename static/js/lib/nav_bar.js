/** @jsx React.DOM */

var React = require('react');
var NavBarFB = require('./nav_bar_fb').NavBarFB;

exports.NavBar = React.createClass({
  render: function() {
    return (
      <div className="navbar navbar-fixed-top" id="top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">El Cap Challenge</a>
          </div>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
            <li className="active"><a href="#home">Home</a></li>
            <li><a href="#eagleseye">Eagle's-eye View</a></li>
            <li><a href="#climber">Climber</a></li>
            <li><a href="#admin">Admin</a></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li><NavBarFB /></li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
});
