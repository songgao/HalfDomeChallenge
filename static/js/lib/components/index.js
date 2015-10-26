/** @jsx React.DOM */

var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var NavBar = require('./nav_bar');

var Home = require('./home');
var Stats = require('./stats');
var Me = require('./me');
var Admin = require('./admin');
var Report = require('./report');
var HiddenGems = require('./hidden-gems');

var routes = {
  '#home': Home,
  '#eagleseye': Stats,
  '#me': Me,
  '#admin': Admin,
  '#report': Report,
};

module.exports = React.createClass({
  _hashChange: function() {
    this.setState({hash: window.location.hash});
  },
  getInitialState: function() {
    return {
      hash: window.location.hash,
    };
  },
  componentDidMount: function() {
    $(window).on('hashchange', this._hashChange);
  },
  componentWillUnmount: function() {
    $(window).off('hashchange', this._hashChange);
  },
  render: function() {
    var O_O = routes[this.state.hash];
    var active = this.state.hash;
    if (!O_O) {
      O_O = Home;
      active = '#home';
    }
    return (
      <div id='O_O'>
        <NavBar key="navbar" active={active} />
        <O_O key={active} />
        <HiddenGems key="hidden-gems" />
      </div>
    );
  },
});
