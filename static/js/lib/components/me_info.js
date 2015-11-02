/** @jsx React.DOM */

var React = require('react');
var moment = require('moment');

var C = require('../constants');
var utils = require('../utils');
var CategorySetter = require('./category_setter');
var MeRoyal = require('./me_royal');
var Chips = require('./chips');

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

    var aubie;
    if (this.props.logs.length >= C.TotalPitches) {
      aubie = (
          <img className="aubie" src="/images/aubie.png" />
      );
    } else {
      aubie = (<span></span>);
    }
    var logRatings = this.props.logs.map(function(log) {
      return log.route.rating;
    });

    return (
      <div className="panel panel-default me-info">
        <div key="titleline" className="title-line">
          <div key="user-name"><h3>{this.props.user.name}</h3></div>
          <div key="category" className="category-label">{category}</div>
          <CategorySetter key="setter" set={categorySet} />
        </div>
        {aubie}
        <div key="joined">Joined {moment(this.props.user.since).fromNow()}</div>
        <div key="status">Finished: {this.props.logs.length.toString()}/{C.TotalPitches.toString()} | Royalness: {Math.round(utils.calculateRoyalness(logRatings) * 100) / 100}</div>
        <Chips key="chips" className="me-info-chips" category={this.props.user.category} logRatings={logRatings} />
        <MeRoyal key="royal" logRatings={logRatings} />
      </div>
    );
  }
});
