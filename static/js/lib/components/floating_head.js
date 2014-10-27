/** @jsx React.DOM */

var React = require('react/addons');

module.exports = React.createClass({
  render: function() {
    var headPerc = this.props.percentage <= 1 ? this.props.percentage : 1;
    var floatingHeadStyle = {
      top: Math.round((1-headPerc)*95).toString() + '%',
      // if pos is not specified, this is the only floating head being
      // displayed, thus simply put in the optimal position
      left: this.props.pos ? (Math.round(this.props.pos * 70).toString() + '%') : '30%' ,
      opacity: this.props.recentness ? 1-.4*this.props.recentness : 1,
    };
    var percentageStr = Math.round(this.props.percentage * 100).toString() + '%';
    return (
      <div style={floatingHeadStyle} className="floating-head">
        <img src={this.props.picture} className="img-circle" />
        <span>{percentageStr} done</span>
      </div>
    );
  },
});
