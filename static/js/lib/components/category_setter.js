/** @jsx React.DOM */

var React = require('react/addons');

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
        <a className="pointer" data-toggle="modal" data-target="#dialogCategory">
          Set Category
        </a>
      );
    } else {
      btn = (
        <a className="pointer" data-toggle="modal" data-target="#dialogCategory">
          change
        </a>
      );
    }
    return (
      <div className="category-setter-div">
        {btn}
        <div className="modal fade" id="dialogCategory" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog">
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
                      <li>You may climb to the top using any hold/feet;</li>
                      <li>Auto-belay (cupcake wall) is permitted.</li>
                    </ul>
                  </div>
                  <div className="col-sm-4 category-description">
                    <button type="button" className="btn btn-warning" data-dismiss="modal" onClick={this._handleUpdateCategory} id="btn-category-intermediate">Intermediate</button>
                    <ul>
                      <li>You must climb set routes (no&nbsp;rainbow&#39;ing);</li>
                      <li>Cupcake/Auto-belay is NOT permitted;</li>
                      <li>You may NOT climb the same route twice in a day.</li>
                    </ul>
                  </div>
                  <div className="col-sm-4 category-description">
                    <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this._handleUpdateCategory} id="btn-category-advanced">Advanced</button>
                    <ul>
                      <li>You and your partner must lead/follow every route (pitch);</li>
                      <li>You may climb the same route twice in a day;</li>
                      <li>Rainbow&#39;ing is NOT permitted.</li>
                    </ul>
                  </div>
                </div>
                <div className="category-description">
                For all categories: You must climb FULL pitch (inside wall is NOT permitted).
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )
  }
});
