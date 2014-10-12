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
        <button className="btn btn-default" data-toggle="modal" data-target="#dialogCategory">
          Set Category
        </button>
      );
    } else {
      btn = (
        <button className="btn btn-link" data-toggle="modal" data-target="#dialogCategory">
          change
        </button>
      );
    }
    return (
      <span>
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
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  </div>
                  <div className="col-sm-4 category-description">
                    <button type="button" className="btn btn-warning" data-dismiss="modal" onClick={this._handleUpdateCategory} id="btn-category-intermediate">Intermediate</button>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  </div>
                  <div className="col-sm-4 category-description">
                    <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this._handleUpdateCategory} id="btn-category-advanced">Advanced</button>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </span>
      )
  }
});
