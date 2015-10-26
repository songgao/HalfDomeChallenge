/** @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({
  _onSelect: function(index) {
    var s = {selectedIndex: index, selectedRef: this.props.options[index].ref};
    if (this.props.onSelect) {
      this.props.onSelect(s);
    }
  },
  render: function() {
    var selectedIndex = -1;
    var lis = this.props.options.map(function(option, index) {
      var onClick = function() { this._onSelect(index); }.bind(this);
      if (option.ref === this.props.selectedRef) {
        selectedIndex = index;
      }
      return (
        <li key={index}>
          <button type="button" className="btn btn-link" onClick={onClick}>
            {option.dom}
          </button>
        </li>
      );
    }.bind(this));
    var dropdown = (
        <div>
        {(selectedIndex > -1 && this.props.options[selectedIndex]) ? this.props.options[selectedIndex].dom : "empty O_O"}
        <span className="caret"></span>
        </div>
    );
    return (
      <div className="btn-group selector-div">
        <button key="button" type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
          {(!this.props.options || this.props.options.length === 0) ? "empty" : dropdown}
        </button>
        <ul key="menu" className="dropdown-menu" role="menu">
          {lis}
        </ul>
      </div>
    );
  }
});
