/** @jsx React.DOM */

var React = require('react/addons');

var fb_action = require('../actions/fb_actions');
var fb = require('../stores/fb_login').fb_login;

module.exports = React.createClass({
  getInitialState: function() {
    return {profile: fb.fb_profile, status: fb.login_status ? fb.login_status.status : null};
  },
  _onChange: function() {
    this.setState({profile: fb.fb_profile, status: fb.login_status ? fb.login_status.status : null});
  },
  componentDidMount: function() {
    fb.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    fb.removeChangeListener(this._onChange);
  },
  handleLogin: function(e) {
    fb_action.loginButtonClick()
  },
  handleLogout: function(e) {
    fb_action.logoutButtonClick()
  },
  render: function() {
    if(this.state.status === 'connected') {
      var picture_url = "//graph.facebook.com/" + this.state.profile.id + "/picture?height=48";
      return (
        <div>
        <p className="navbar-text">{this.state.profile.name}</p>
        <img src={picture_url} alt="Profile Picture" className="img-circle profile-picture"/>
        <button onClick={this.handleLogout} className="btn btn-default">Logout</button>
        </div>
      );
    } else {
      return (
        <button onClick={this.handleLogin} type="button" className="btn btn-primary navbar-btn">Log in with Facebook</button>
      );
    }
  }
});
