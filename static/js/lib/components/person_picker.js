/** @jsx React.DOM */

var React = require('react/addons');

var usersStore = require('../stores/users');
var utils = require('../utils');

module.exports = React.createClass({
  getInitialState: function() {
    return {users: usersStore.users, selected: null, text: "", options: [], showOptions: false}
  },
  _generateOptions: function(text) {
    if (!this.state.users) {
      return [];
    }
    var t = text.toLowerCase();
    var ret = [];
    for (var i = 0; i < this.state.users.length; ++i) {
      if(this.state.users[i].name.toLowerCase().indexOf(t) !== -1) {
        ret.push(this.state.users[i]);
      }
    }
    return ret;
  },
  _onUsersChange: function() {
    this.setState({users: usersStore.users, options: this._generateOptions(this.state.text)});
  },
  _handleTextChange: function(e) {
    this.setState({text: e.target.value, options: this._generateOptions(e.target.value), showOptions: true});
  },
  _handleSelect: function(user) {
    this.setState({showOptions: false, selected: user});
  },
  _handleChangeSelected: function(user) {
    this.setState({showOptions: true, selected: null}, function() {
      this.refs.nameInputText.getDOMNode().focus();
      utils.moveCursorToEnd(this.refs.nameInputText.getDOMNode());
    });
  },
  componentDidMount: function() {
    usersStore.addChangeListener(this._onUsersChange);
  },
  componentWillUnmount: function() {
    usersStore.removeChangeListener(this._onUsersChange);
  },
  render: function() {
    if (this.state.selected) {
      return (
          <div>
            <div className="btn btn-link" onClick={this._handleChangeSelected}>
              <img src={this.state.selected.picture_url + "?height=42"} className="img-circle"/>
              <span className="person-picker-name">{this.state.selected.name}</span>
            </div>
            <span>&#60;&#60; click to change</span>
          </div>
      );
    } else {
      var people = this.state.options.map(function(option) {
        var onClick = function() { this._handleSelect(option); }.bind(this);
        return (
          <li>
          <div className="btn btn-link" onClick={onClick}>
            <img src={option.picture_url + "?height=42"} className="img-circle"/>
            <span className="person-picker-name">{option.name}</span>
          </div>
          </li>
        );
      }.bind(this));
      if(!people || !people.length) {
        people.push(
            <li className="text-center"><span>empty O_O </span></li>
        );
      }
      return (
        <div className={this.state.showOptions ? 'person-picker dropdown open' : 'person-picker dropdown'}>
          <input type="text" className="form-control" placeholder="Parter Name" ref="name" value={this.state.text} onChange={this._handleTextChange} ref="nameInputText" />
          <ul className="dropdown-menu" role="menu">
          {people}
          </ul>
        </div>
      );
    }
  }
});
