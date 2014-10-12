/** @jsx React.DOM */

var React = require('react/addons');
var moment = require('moment');

var C = require('../constants');
var CategorySetter = require('./category_setter');

module.exports = React.createClass({
  render: function() {
    if(!this.props.user) {
      return null;
    }

    var category, categorySet = true;
    if(this.props.user.category === C.Categories[0]) {
      category = <span className="label label-success category-label">{this.props.user.category}</span>
    } else if(this.props.user.category === C.Categories[1]) {
      category = <span className="label label-warning category-label">{this.props.user.category}</span>
    } else if(this.props.user.category === C.Categories[2]) {
      category = <span className="label label-danger category-label">{this.props.user.category}</span>
    } else {
      category = (<div></div>);
      categorySet = false;
    }
    return (
      <div className="panel panel-default me-info">
        <div>
          <h3>{this.props.user.name} {category}</h3>
          <CategorySetter set={categorySet} />
        </div>
        <div> Joined {moment(this.props.user.since).fromNow()} </div>
      </div>
    );
  }
});
