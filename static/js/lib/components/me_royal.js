/** @jsx React.DOM */

var React = require('react');

var C = require('../constants');
var utils = require('../utils');

module.exports = React.createClass({
  render: function() {
    if (this.props.logRatings.length >= C.Pitches.length) {
      return (<div></div>);
    }

    var nextRoute = C.Pitches[this.props.logRatings.length];
    var nextRouteDesc;
    if (utils.getRatingNumber(nextRoute) <= 6) {
      nextRouteDesc = "any 5.6 routes";
    } else {
      nextRouteDesc = "any 5." + utils.getRatingNumber(nextRoute).toString() + " routes";
    }
    var text = (
        <div key="royal-text">You next royal pitch is {nextRoute}. You can climb {nextRouteDesc} to qualify for a <span className="label royal">Royal</span> badge.</div>
        );

    var pitches = C.Pitches.map(function(pitch, index) {
      var isRoyal = false;
      if (index < this.props.logRatings.length) {
        isRoyal = utils.isRoyal(index, this.props.logRatings[index]);
      }
      return <div className="royal-pitch"><span className={isRoyal ? "badge royal" : "badge"}>{index+1}</span>{pitch}</div>
    }.bind(this));

    return (
      <div>
        {text}
        <a key="btn" className="pointer" data-toggle="modal" data-target="#dialogRoyal">What's Royal?</a>
        <div key="modal" className="modal fade" id="dialogRoyal" tabIndex="-1" role="dialog" aria-labelledby="royalModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                <h4 className="modal-title">Royal Pitches and Royalness</h4>
              </div>
              <div className="modal-body container-fluid">
                <div key="d1">For those of you serious climbers, we have prepared for you a special challenge. Following are the Northwest Face 'Regular' route on the Half Dome. Climbing these pitches in the same order gives you <span className="label royal">Royal</span> badges.</div>
                <div key="d2" className="royal-pitches">{pitches}</div>
                <div key="d3">The royalness value, calculated from royal pitches climbed divided by total pitches climbed, indicates how royal you are.</div>
                <hr />
                {text}
              </div>
            </div>
          </div>
        </div>
      </div>
      )
  }
});
