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
      category = (<span></span>);
      categorySet = false;
    }
    var chips = this.props.logs.map(function(log) {
      var chipStyle = {
        "background-color": C.Rainbow(C.Ratings[log.route.rating] / (C.Ratings.all.length - 1)),
      }
      return <div className = "rainbow-chip" style={chipStyle}></div>;
    }.bind(this));
    return (
      <div className="panel panel-default me-info">
        <div className="title-line">
          <div><h3>{this.props.user.name}</h3></div>
          <div className="category-label">{category}</div>
          <CategorySetter set={categorySet} />
        </div>
        <div className="clearfix">Joined {moment(this.props.user.since).fromNow()} | Finished: {this.props.logs.length.toString() + ' / ' + C.TotalPitches.toString()}</div>
        <div className="me-info-chips">{chips}</div>
      </div>
    );
  }
});
