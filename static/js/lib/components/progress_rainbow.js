/** @jsx React.DOM */

var React = require('react/addons');

var C = require('../constants');

module.exports = React.createClass({
  render: function() {
    console.log(this.props.logs);
    var chips = this.props.logs.map(function(log) {
      var chipStyle = {
        "background-color": C.Rainbow(log / (C.Ratings.all.length - 1)),
      };
      return <div className="rainbow-chip" style={chipStyle}></div>;
    });
    return (
      <div className="row progress-rainbow">
        <div className="col-sm-12">
          <div className="rainbow-name-picture">
            {this.props.name}<img src={this.props.picture} className="img-circle" />
          </div>
          <div className="rainbow-chips">
            {chips}
          </div>
          <div className="rainbow-percentage">
            {Math.round(this.props.percentage * 100).toString() + '%'}
          </div>
        </div>
      </div>
    )
  }
});
