/** @jsx React.DOM */

var React = require('react');
var NavBar = require('./nav_bar').NavBar;

exports.Home = React.createClass({
  render: function() {
    return (
      <NavBar />
    )
  }
});

