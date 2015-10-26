/** @jsx React.DOM */

var React = require('react');
var NavBarFB = require('./nav_bar_fb');
var meStore = require('../stores/me');

var tabs = [
  {href: '#home'     , text: 'Home'},
  {href: '#eagleseye', text: "Eagle's-eye View"},
  {href: '#me'       , text: "Me"},
  {href: '#admin'    , text: "Admin", needAdmin: true },
  {href: '#report'   , text: "Report", needAdmin: true },
];

module.exports = React.createClass({
  getInitialState: function() {
    return {isAdmin: false};
  },
  _onMeStoreChange: function() {
    if (meStore.user) {
      this.setState({isAdmin: meStore.user.is_admin ? true : false});
    } else {
      this.setState({isAdmin: false});
    }
  },
  componentDidMount: function() {
    meStore.addChangeListener(this._onMeStoreChange);
    this._onMeStoreChange();
  },
  componentWillUnmount: function() {
    meStore.removeChangeListener(this._onMeStoreChange);
  },
  _handleItemClick: function() {
    $('#navbar-main').collapse('hide');
  },
  render: function() {
    var items = tabs.map(function(item) {
      if (item.needAdmin && !this.state.isAdmin) {
        return null;
      }
      var cn = this.props.active === item.href ? 'active' : "";
      return <li key={item.href} className={cn}><a href={item.href} onClick={this._handleItemClick}>{item.text}</a></li>
    }.bind(this));
    return (
      <div className="navbar navbar-default navbar-fixed-top" id="top">
        <div className="container">
          <div key="header" className="navbar-header">
            <button key="nav_button" type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-main">
              <span key="toggle" className="sr-only">Toggle navigation</span>
              <span key="1" className="icon-bar"></span>
              <span key="2" className="icon-bar"></span>
              <span key="3" className="icon-bar"></span>
            </button>
            <a key="logo" className="navbar-brand" href="#">El Cap Challenge</a>
          </div>
          <div key="main" className="collapse navbar-collapse" id="navbar-main">
            <ul key="nav" className="nav navbar-nav">
            {items}
            </ul>
            <div key="fb" className="navbar-right">
              <NavBarFB />
            </div>
          </div>
        </div>
      </div>
    )
  }
});
