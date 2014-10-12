/** @jsx React.DOM */

var React = require('react/addons');

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
      this.setState({selectedRef: this.props.options[this.state.selectedIndex].ref});
    }
  },
  _onSelect: function(index) {
    this.setState({selectedIndex: index, selectedRef: this.props.options[index].ref});
  },
  render: function() {
    var lis = this.props.options.map(function(option, index) {
      var onClick = function() { this._onSelect(index); }.bind(this);
      return <li><button type="button" className="btn btn-link" onClick={onClick}>{option.dom}</button></li>
    }.bind(this));
    return (
      <div className="btn-group selector-div">
        <button type="button" className="btn btn-link dropdown-toggle" data-toggle="dropdown">
          {(!this.props.options || this.props.options.length === 0) ? "empty" : this.props.options[this.state.selectedIndex].dom}
        </button>
        <ul className="dropdown-menu" role="menu">
          {lis}
        </ul>
      </div>
    );
  }
});
