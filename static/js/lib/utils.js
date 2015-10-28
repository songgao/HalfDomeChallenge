var C = require('./constants');
var usersStore = require('./stores/users');
var routesStore = require('./stores/routes');

exports.moveCursorToEnd = function(el) {
  if (typeof el.selectionStart == "number") {
    el.selectionStart = el.selectionEnd = el.value.length;
  } else if (typeof el.createTextRange != "undefined") {
    el.focus();
    var range = el.createTextRange();
    range.collapse(false);
    range.select();
  }
};

exports.generateLogs = function(user, bareLogs) {
  if (!bareLogs || !bareLogs.length || !user) {
    return [];
  }
  var logs = bareLogs.map(function(log, index) {
    var others = [];
    for (var i = 0; i < log.climbers.length; ++i) {
      if (log.climbers[i] !== user.id) {
        others.push(usersStore.findOrMissing(log.climbers[i]).name);
      }
    }
    var ret = {
      id: log.id,
      time: log.time,
      route: routesStore.findOrMissing(log.route),
      pending: log.pending,
      others: others
    };
    ret.royal = (ret.route.rating === C.Pitches[index]);
    return ret;
  }.bind(this));
  return logs;
}
