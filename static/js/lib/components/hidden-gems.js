/** @jsx React.DOM */

var meStore = require('../stores/me');

var youtubeSDK = require('require-sdk')('https://www.youtube.com/iframe_api', 'YT');
window.onYouTubeIframeAPIReady = youtubeSDK.trigger();
var youtube, player;

youtubeSDK(function(err, y) {
  if (err) {
    return;
  }
  youtube = y;
});

var React = require('react');

var triggerKeys = "wareagle";
module.exports = React.createClass({
  getInitialState: function() {
    return {keys: ""}
  },
  _ensurePlayer: function() {
    if(!player && youtube) {
      player = new youtube.Player('player', {
        width: '100%',
        height: '100%',
        videoId: '8GKmkD1pUG0',
        playerVars: {
          start: 10,
          end: 38,
          controls: 0,
          showinfo: 0,
        },
        events: {
          'onReady': this._onPlayerReady,
          'onStateChange': this._onPlayerStateChange
        }
      });
    }
  },
  _onPlayerReady: function(e) {
    e.target.setPlaybackQuality('large');
    e.target.playVideo();
  },
  _onPlayerStateChange: function(e) {
    if (e.data == youtube.PlayerState.ENDED) {
      this.setState({keys: ""});
    }
  },
  _onMeFinish: function() {
    this.setState({keys: triggerKeys});
  },
  _handleKeyPress: function(e) {
    var newKeys = this.state.keys + String.fromCharCode(e.which).toLowerCase();
    if (triggerKeys.indexOf(newKeys) === 0) {
      this.setState({keys: newKeys});
    } else {
      this.setState({keys: ""});
    }
  },
  _handleVideoEnd: function() {
    this.setState({keys: ""});
  },
  componentDidMount: function() {
    document.onkeypress = this._handleKeyPress;
    meStore.addFinishListener(this._onMeFinish);
  },
  componentWillUnmount: function() {
    document.onkeypress = null;
    if (player && player.destroy) {
      player.destroy();
    }
    meStore.removeFinishListener(this._onMeFinish);
  },
  render: function() {
    if (this.state.keys !== triggerKeys) {
      if (player && player.destroy) {
        player.destroy();
        player = null;
      }
      return <div></div>;
    }
    process.nextTick(this._ensurePlayer);
    return (
      <div id='hidden-gems'>
        <div id="player"></div>
      </div>
    );
  }
});
