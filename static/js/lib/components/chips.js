/** @jsx React.DOM */

var React = require('react');
var C = require('../constants');

module.exports = React.createClass({
  render: function() {
    var chips = this.props.logRatings.map(function(rating, index) {
      var chipStyle = {
        backgroundColor: C.Rainbow[this.props.category](C.Ratings[rating] / (C.Ratings.all.length - 1)),
      };
      return <div key={rating + index.toString()} className = "rainbow-chip" style={chipStyle} />
    }.bind(this));
    return (
      <div className={this.props.className}>{chips}</div>
    );
  }
});
