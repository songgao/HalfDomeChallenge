/** @jsx React.DOM */

var React = require('react');

var C = require('../constants');
var utils = require('../utils');
var Chips = require('./chips');

module.exports = React.createClass({
  render: function() {
    var slice;
    if (this.props.logRatings.length > C.TotalPitches) {
      slice = this.props.logRatings.slice(-C.TotalPitches);
    } else {
      slice = this.props.logRatings;
    }

    return (
      <div className="row progress-rainbow">
        <div className="col-sm-12">
          <div key="picture" className="rainbow-name-picture">
            <span key="span" className="rainbow-name">{this.props.name}</span>
            <img key="img" src={this.props.picture} className="img-circle" />
          </div>
          <Chips className="rainbow-chips" category={this.props.category} logRatings={slice} />
          <div key="percentage" className="rainbow-percentage">
            {Math.round(this.props.percentage * 100).toString() + '%'} <span className="royal-fg">({Math.round(utils.calculateRoyalness(this.props.logRatings) * 100).toString() + '%'})</span>
          </div>
        </div>
      </div>
    )
  }
});
