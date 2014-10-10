/** @jsx React.DOM */

var React = require('react');

var Home = require('./home').Home;
var Stats = require('./stats').Stats;
var Climber = require('./climber').Climber;

var routes = {
  '#home': Home,
  '#eagleseye': Stats,
  '#climber': Climber,
};

$(window).on('hashchange', function() {
  var component = routes[location.hash];
  if(component) {
    React.renderComponent(component(), document.getElementById('O_O'));
  }
});

if(!routes[location.hash]) {
  location.hash = '#home';
} else {
  $(window).trigger('hashchange');
}
