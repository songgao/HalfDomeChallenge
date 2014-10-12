/** @jsx React.DOM */

var React = require('react/addons');
var NavBarFB = require('./nav_bar_fb');
var meStore = require('../stores/me');

var tabs = [
  {href: '#home'     , text: 'Home'},
  {href: '#eagleseye', text: "Eagle's-eye View"},
  {href: '#me'       , text: "Me"},
  {href: '#admin'    , text: "Admin", needAdmin: true },
];

module.exports = React.createClass({
  getInitialState: function() {
    return {isAdmin: false};
  },
  _onMeStoreChange: function() {
    console.log(meStore);
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
  render: function() {
    var items = tabs.map(function(item) {
      if (item.needAdmin && !this.state.isAdmin) {
        return null;
      }
      var cn = this.props.active === item.href ? 'active' : "";
      return <li className={cn}><a href={item.href}>{item.text}</a></li>
    }.bind(this));
    return (
      <div className="navbar navbar-default navbar-fixed-top" id="top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-main">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">El Cap Challenge</a>
          </div>
          <div className="collapse navbar-collapse" id="navbar-main">
            <ul className="nav navbar-nav">
            {items}
            </ul>
            <div className="navbar-right">
              <NavBarFB />
            </div>
          </div>
        </div>
      </div>
    )
  }
});
