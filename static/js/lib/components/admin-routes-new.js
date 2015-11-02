/** @jsx React.DOM */

var React = require('react');

var Selector = require('./selector');
var actions = require('../actions/admin_actions');
var C = require('../constants');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      name: "",
      rating: null,
      nats: 1,
      ff: true,
      is_half: false,
      setter: "",
      tape: null,
    }
  },
  _handleNameOnChange: function(e) {
    this.setState({name: e.target.value});
  },
  _handleRatingOnSelect: function(e) {
    this.setState({rating: e.selectedRef});
  },
  _handleNATSOnChange: function(e) {
    if (e.target.checked) {
      this.setState({nats: parseInt(e.target.value)});
    }
  },
  _handleFFOnChange: function(e) {
    if (e.target.checked) {
      this.setState({ff: e.target.value === 'true' });
    }
  },
  _handleIsHalfOnChange: function(e) {
    if (e.target.checked) {
      this.setState({is_half: e.target.value === 'true' });
    }
  },
  _handleSetterOnChange: function(e) {
    this.setState({setter: e.target.value});
  },
  _handleTapeOnSelect: function(e) {
    this.setState({tape: e.selectedRef});
  },
  _handleNewRoute: function(e) {
    var route = {
      name: this.state.name,
      rating: this.state.rating,
      nats: this.state.nats,
      ff: this.state.ff,
      is_half: this.state.is_half,
      setter: this.state.setter,
      background_color: this.state.tape.background_color,
      color: this.state.tape.color,
      enabled: true,
    };
    if(!(route.name && route.setter)) {
      // TODO: this is ugly; change to sweetalert or in page warning some time
      alert('Please make sure you entered values for both name and setter');
      return
    }
    actions.newRoute(route);
    $('#dialogNewRoute').modal('hide'); // TODO: shouldn't use jquery for DOM
  },
  render: function() {
    var ratingOptions = C.Ratings.all.map(function(rating) {
      return {dom: (<span>{rating}</span>), ref: rating};
    });
    var tapeOptions = C.Tapes.map(function(tape, index) {
      var style = {
        backgroundColor: tape.background_color,
        color: tape.color,
        padding: "4px",
        textAlign: "center",
      };
      return {dom: (<span style={style}>{tape.name}</span>), ref: tape}
    });
    return (
      <div>
        <button className="btn btn-primary" data-toggle="modal" data-target="#dialogNewRoute">
          New Route
        </button>
        <div className="modal fade" id="dialogNewRoute" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" ref="dialogNewRoute">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                <h4 className="modal-title">Add New Route</h4>
              </div>
              <div className="modal-body container-fluid">
                <form className="form-horizontal" role="form">

                  <div className="form-group">
                    <label htmlFor="new-route-name" className="col-sm-3 control-label">Name</label>
                    <div className="col-sm-9">
                      <input type="text" className="form-control" id="new-route-name" placeholder="Route Name" ref="name" value={this.state.name} onChange={this._handleNameOnChange} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="new-route-setter" className="col-sm-3 control-label">Set By</label>
                    <div className="col-sm-9">
                      <input type="text" className="form-control" id="new-route-setter" placeholder="Setter Name / Initials" ref="setter" value={this.state.setter} onChange={this._handleSetterOnChange} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="new-route-rating" className="col-sm-3 control-label">Rating</label>
                    <div className="col-sm-9">
                      <Selector options={ratingOptions} selectedRef={this.state.rating} ref="ratingSelector" onSelect={this._handleRatingOnSelect} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="new-route-tape" className="col-sm-3 control-label">Tape Color</label>
                    <div className="col-sm-9">
                      <Selector options={tapeOptions} selectedRef={this.state.tape} ref="tapeSelector" onSelect={this._handleTapeOnSelect} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="new-route-nats" className="col-sm-3 control-label">Natural Features</label>
                    <div className="col-sm-9">
                      <label className="radio-inline">
                        <input type="radio" name="new-route-nats" id="new-route-nats-on" value={1} checked={this.state.nats===1} ref="natsOn" onChange={this._handleNATSOnChange} />Nats ON
                      </label>
                      <label className="radio-inline">
                        <input type="radio" name="new-route-nats" id="new-route-nats-off" value={3} checked={this.state.nats===3} ref="natsOff" onChange={this._handleNATSOnChange} />Nats OFF
                      </label>
                      <label className="radio-inline">
                        <input type="radio" name="new-route-nats" id="new-route-nats-feet-only" value={2} checked={this.state.nats===2} ref="natsFeetOnly" onChange={this._handleNATSOnChange} />Nats Feet Only
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="new-route-ff" className="col-sm-3 control-label">Follow Feet?</label>
                    <div className="col-sm-9">
                      <label className="radio-inline">
                        <input type="radio" name="new-route-ff" id="new-route-ff-ff" value={true} checked={this.state.ff===true} defaultChecked={true} ref="ff" onChange={this._handleFFOnChange} />FF
                      </label>
                      <label className="radio-inline">
                        <input type="radio" name="new-route-ff" id="new-route-ff-af" value={false} checked={this.state.ff===false} ref="af" onChange={this._handleFFOnChange} />AF
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="new-route-ff" className="col-sm-3 control-label">Half Route?</label>
                    <div className="col-sm-9">
                      <label className="radio-inline">
                        <input type="radio" name="new-route-is_half" id="new-route-is_half-full" value={false} checked={this.state.is_half===false} defaultChecked={true} ref="full" onChange={this._handleIsHalfOnChange} />Full Route
                      </label>
                      <label className="radio-inline">
                        <input type="radio" name="new-route-is_half" id="new-route-is_half-half" value={true} checked={this.state.is_half===true} ref="full" onChange={this._handleIsHalfOnChange} />Half Route
                      </label>
                    </div>
                  </div>

                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={this._handleNewRoute}>Create</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )
  }
});
