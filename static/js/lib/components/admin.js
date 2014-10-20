/** @jsx React.DOM */

var React = require('react/addons');

var AdminPending = require('./admin-pending');
var AdminRoutes = require('./admin-routes');
var Peeker = require('./peeker');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="container fullheight">
        <div className="jumbotron">
          <h1>Hey there SuperUser!</h1>
          <p>With great power comes great responsibility. Be careful and WDE!</p>
        </div>

        <ul className="nav nav-tabs" role="tablist">
          <li className="active"><a href="#admin-pendings" role="tab" data-toggle="tab">Pendings</a></li>
          <li><a href="#admin-routes" role="tab" data-toggle="tab">Routes</a></li>
          <li><a href="#admin-peeker" role="tab" data-toggle="tab">Peek</a></li>
        </ul>

        <div className="tab-content">
          <div className="tab-pane active" id="admin-pendings"><AdminPending /></div>
          <div className="tab-pane" id="admin-routes"><AdminRoutes /></div>
          <div className="tab-pane" id="admin-peeker"><Peeker /></div>
        </div>
      </div>
    );
  }
});

