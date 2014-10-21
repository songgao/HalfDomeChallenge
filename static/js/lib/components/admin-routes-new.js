/** @jsx React.DOM */

var React = require('react/addons');

var Selector = require('./selector');
var actions = require('../actions/admin_actions');
var C = require('../constants');

module.exports = React.createClass({
  _handleNewRoute: function(e) {
    var nats = this.refs.natsOn.props.value;
    if (this.refs.natsOff.state.checked) {
      nats = this.refs.natsOff.props.value;
    } else if (this.refs.natsPartial.state.checked) {
      nats = this.refs.natsPartial.props.value;
    }
    var route = {
      name: this.refs.name.state.value,
      rating: this.refs.ratingSelector.state.selectedRef,
      nats: nats,
      ff: this.refs.ff.state.checked,
      setter: this.refs.setter.state.value,
      background_color: this.refs.tapeSelector.state.selectedRef.background_color,
      color: this.refs.tapeSelector.state.selectedRef.color,
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
        "background-color": tape.background_color,
        "color": tape.color,
        "padding": "4px",
        "text-align": "center",
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
                    <label for="new-route-name" className="col-sm-3 control-label">Name</label>
                    <div className="col-sm-9">
                      <input type="text" className="form-control" id="new-route-name" placeholder="Route Name" ref="name" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label for="new-route-setter" className="col-sm-3 control-label">Set By</label>
                    <div className="col-sm-9">
                      <input type="text" className="form-control" id="new-route-setter" placeholder="Setter Name / Initials" ref="setter"/>
                    </div>
                  </div>

                  <div className="form-group">
                    <label for="new-route-rating" className="col-sm-3 control-label">Rating</label>
                    <div className="col-sm-9">
                      <Selector options={ratingOptions} defaultIndex={C.Ratings["5.9-"]} ref="ratingSelector"/>
                    </div>
                  </div>

                  <div className="form-group">
                    <label for="new-route-tape" className="col-sm-3 control-label">Tape Color</label>
                    <div className="col-sm-9">
                      <Selector options={tapeOptions} ref="tapeSelector" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label for="new-route-nats" className="col-sm-3 control-label">Natural Features</label>
                    <div className="col-sm-9">
                      <label className="radio-inline">
                        <input type="radio" name="new-route-nats" id="new-route-nats-on" value={1} defaultChecked={true} ref="natsOn">Nats ON</input>
                      </label>
                      <label className="radio-inline">
                        <input type="radio" name="new-route-nats" id="new-route-nats-off" value={3} ref="natsOff">Nats OFF</input>
                      </label>
                      <label className="radio-inline">
                        <input type="radio" name="new-route-nats" id="new-route-nats-partial" value={2} ref="natsPartial">Nats Partially ON</input>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label for="new-route-ff" className="col-sm-3 control-label">Follow Feet?</label>
                    <div className="col-sm-9">
                      <label className="radio-inline">
                        <input type="radio" name="new-route-ff" id="new-route-ff-ff" value={true} defaultChecked={true} ref="ff">FF</input>
                      </label>
                      <label className="radio-inline">
                        <input type="radio" name="new-route-ff" id="new-route-ff-af" value={false} ref="af">AF</input>
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
