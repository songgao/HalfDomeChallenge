/** @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    var ret = {}
    ret.selectedIndex = this.props.defaultIndex ? this.props.defaultIndex : 0;
    if(this.props.options && this.props.options.length) {
      ret.selectedRef = this.props.options[ret.selectedIndex].ref;
    }
    return ret;
  },
  componentWillReceiveProps: function() {
    if(!this.state.selectedRef && this.props.options && this.props.options.length) {
      var selectedIndex = this.props.defaultIndex ? this.props.defaultIndex : 0;
      this.setState({selectedIndex: selectedIndex, selectedRef: this.props.options[selectedIndex].ref});
    }
  },
  _onSelect: function(index) {
    this.setState({selectedIndex: index, selectedRef: this.props.options[index].ref});
  },
  render: function() {
    var lis = this.props.options.map(function(option, index) {
      var onClick = function() { this._onSelect(index); }.bind(this);
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
        {this.props.options[this.state.selectedIndex] ? this.props.options[this.state.selectedIndex].dom : "empty O_O"}
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
