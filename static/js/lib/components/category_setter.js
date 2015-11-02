/** @jsx React.DOM */

var React = require('react');

var actions = require('../actions/me_actions');

module.exports = React.createClass({
  _handleUpdateCategory: function(e) {
    if(e.target && e.target.id) {
      if(e.target.id === 'btn-category-beginner') {
        actions.updateCategory("Beginner");
      } else if(e.target.id === 'btn-category-intermediate') {
        actions.updateCategory("Intermediate");
      } else if(e.target.id === 'btn-category-advanced') {
        actions.updateCategory("Advanced");
      }
    }
  },
  render: function() {
    var btn;
    if (!this.props.set) {
      btn = (
        <a className="pointer category-setter-a" data-toggle="modal" data-target="#dialogCategory">
          Set Category
        </a>
      );
    } else {
      btn = (
        <a className="pointer category-setter-a" data-toggle="modal" data-target="#dialogCategory">
          change
        </a>
      );
    }
    return (
      <div className="category-setter-div">
        {btn}
        <div className="modal fade" id="dialogCategory" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                <h4 className="modal-title">Choose your category</h4>
              </div>
              <div className="modal-body container-fluid">
                <div className="row">
                  <div className="col-sm-4 category-description">
                    <button type="button" className="btn btn-success" data-dismiss="modal" onClick={this._handleUpdateCategory} id="btn-category-beginner">Beginner</button>
                    <ul>
                      <li>You may climb to the top using any hold/feet (rainbow);</li>
                      <li>Auto-belay is permitted;</li>
                      <li>If you are top-rope skills verified, you are not eligible for this category.</li>
                    </ul>
                  </div>
                  <div className="col-sm-4 category-description">
                    <button type="button" className="btn btn-warning" data-dismiss="modal" onClick={this._handleUpdateCategory} id="btn-category-intermediate">Intermediate</button>
                    <ul>
                      <li>Must be top-rope skills verified;</li>
                      <li>You may climb to the top using any hold/feet (rainbow);</li>
                      <li>You may climb the same route multiple times in a day;</li>
                      <li>Auto-belay is not permitted.</li>
                    </ul>
                  </div>
                  <div className="col-sm-4 category-description">
                    <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this._handleUpdateCategory} id="btn-category-advanced">Advanced</button>
                    <ul>
                      <li>Must be lead verified;</li>
                      <li>You and your partner must lead every route;</li>
                      <li>You may climb the same route multiple times in a day;</li>
                      <li>Rainbow&#39;ing is NOT permitted.</li>
                    </ul>
                  </div>
                </div>
                <div className="category-description">
                For all categories: routes on inside walls count as half-pitch.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )
  }
});
