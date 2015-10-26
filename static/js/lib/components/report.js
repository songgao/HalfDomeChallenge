/** @jsx React.DOM */

var React = require('react');
var moment = require('moment');

var meStore = require('../stores/me');
var reportStore = require('../stores/report');
var reportActions = require('../actions/report_actions');
var ReportItem = require('./report-item');

module.exports = React.createClass({
  getInitialState: function() {
    return {isAdmin: false, progress: 0, finished: false, report: null};
  },
  _onMeStoreChange: function() {
    if (meStore.user) {
      this.setState({isAdmin: meStore.user.is_admin ? true : false});
    } else {
      this.setState({isAdmin: false});
    }
  },
  _onReportStoreProgress: function(progress) {
    this.setState({progress: progress});
  },
  _onReportStoreFinish: function() {
    this.setState({finished: true, report: reportStore.latest, progress: 0});
  },
  _handleStartFetching: function() {
    this.setState({report: null, finished: false, progress: 0});
    reportActions.startFetching();
  },
  componentDidMount: function() {
    meStore.addChangeListener(this._onMeStoreChange);
    reportStore.addProgressListener(this._onReportStoreProgress);
    reportStore.addFinishListener(this._onReportStoreFinish);
    this._onMeStoreChange();
  },
  componentWillUnmount: function() {
    meStore.removeChangeListener(this._onMeStoreChange);
    reportStore.removeProgressListener(this._onReportStoreProgress);
    reportStore.removeFinishListener(this._onReportStoreFinish);
  },
  _handlePrint: function() {
    window.print();
  },
  render: function() {
    var content;
    var progressBarStyle = {visibility: this.state.progress === 0 ? "hidden" : "visible"};
    var buttonDisabled = this.state.progress !== 0;
    if (!this.state.isAdmin) {
      buttonDisabled = true;
      content = (
        <h3>Login as an Admin to use this page</h3>
      );
    } else if (!this.state.report) {
      var percent = (Math.round(this.state.progress * 5) * 20).toString();
    } else {
      var data = this.state.report.data;
      data.sort(function(a, b) {
        if (a.user.name.toLowerCase() > b.user.name.toLowerCase()) {
          return 1;
        } else if (a.user.name.toLowerCase() < b.user.name.toLowerCase()) {
          return -1;
        } else {
          return 0;
        }
      });
      var items = data.map(function(entry) {
        return <ReportItem user={entry.user} logs={entry.logs} />;
      });
      content = ( 
          <div>
            <div className="print">Report generated at {moment(this.state.report.finishedAt).format('llll')}<button type="button" className="btn btn-default btn-xs" onClick={this._handlePrint}>Print</button></div>
            {items}
          </div>
      );
    }

    return (
      <div className="report">
        <div className="progress" style={progressBarStyle} ><div className="progress-bar" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100" style={ {width: percent + "%"} }></div></div>
        <div className="container">
          <button className="btn btn-primary pull-right" disabled={buttonDisabled} onClick={this._handleStartFetching}>Generate Report Now</button>
          {content}
        </div>
      </div>
    );
  }
});

