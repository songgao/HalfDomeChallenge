/** @jsx React.DOM */

var React = require('react');

var fb = require('./fb_login').fb;

exports.NavBarFB = React.createClass({
  getInitialState: function() {
    var self = this;
    fb.ready(function() {
      // called only if fb is not ready by now
      self.setState({profile: fb.fb_profile, status: fb.fb_status});
    });
    return {profile: fb.fb_profile, status: fb.fb_status};
  },
  handleLogin: function(e) {
    fb.login(function() {
      this.setState({profile: fb.fb_profile, status: fb.fb_status});
    }.bind(this));
  },
  render: function() {
    console.log(this.state);
    if(this.state.status === null) {
      return (
        <div/>
      );
    } else if(this.state.status === 'connected') {
      return (
        <div>place holder</div>
      );
    } else {
      return (
        <button onClick={this.handleLogin} type="button" className="btn btn-primary navbar-btn">Log in with Facebook</button>
      );
    }
  }
});
