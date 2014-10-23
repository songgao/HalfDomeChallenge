/** @jsx React.DOM */

var React = require('react/addons');

var AdminPending = require('./admin-pending');
var AdminRoutes = require('./admin-routes');
var Peeker = require('./peeker');
var meStore = require('../stores/me');

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
  render: function() {
    if (!this.state.isAdmin) {
      return (
        <div className="container-fluid center">
          <h3>Login as an Admin to use this page</h3>
        </div>
      );
    }
    return (
      <div className="container fullheight">
        <div className="jumbotron">
          <h2>Hey there SuperUser!</h2>
          <p>With great power comes great responsibility. Be careful and WDE!</p>
        </div>

        <ul className="nav nav-tabs" role="tablist">
          <li className="active"><a href="#admin-pendings" role="tab" data-toggle="tab">Pendings</a></li>
          <li><a href="#admin-routes" role="tab" data-toggle="tab">Routes</a></li>
          <li><a href="#admin-peeker" role="tab" data-toggle="tab">Peek</a></li>
        </ul>

        <div className="tab-content">
          <div className="admin-tab tab-pane active" id="admin-pendings"><AdminPending /></div>
          <div className="admin-tab tab-pane" id="admin-routes"><AdminRoutes /></div>
          <div className="admin-tab tab-pane" id="admin-peeker"><Peeker /></div>
        </div>
      </div>
    );
  }
});

