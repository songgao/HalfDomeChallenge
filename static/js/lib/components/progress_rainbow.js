/** @jsx React.DOM */

var React = require('react');

var C = require('../constants');

module.exports = React.createClass({
  render: function() {
    var slice;
    if (this.props.logs.length > C.TotalPitches) {
      slice = this.props.logs.slice(-C.TotalPitches);
    } else {
      slice = this.props.logs;
    }
    var chips = slice.map(function(log, index) {
      var chipStyle = {
        backgroundColor: C.Rainbow[this.props.category](log / (C.Ratings.all.length - 1)),
      };
      return <div key={index.toString() + ":" + log.toString()} className="rainbow-chip" style={chipStyle}></div>;
    }.bind(this));
    return (
      <div className="row progress-rainbow">
        <div className="col-sm-12">
          <div key="picture" className="rainbow-name-picture">
            <span key="span" className="rainbow-name">{this.props.name}</span>
            <img key="img" src={this.props.picture} className="img-circle" />
          </div>
          <div key="chips" className="rainbow-chips">
            {chips}
          </div>
          <div key="percentage" className="rainbow-percentage">
            {Math.round(this.props.percentage * 100).toString() + '%'}
          </div>
        </div>
      </div>
    )
  }
});
