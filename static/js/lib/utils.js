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

exports.getRatingNumber = function(rating) {
  if (C.Ratings[rating] === 0) {
    return 0; // rainbow
  } else {
    return parseInt(rating.substring(2));
  }
};

exports.isRoyal = function(index, rating) {
  var expected = exports.getRatingNumber(C.Pitches[index]);
  var actual = exports.getRatingNumber(rating);
  if (expected <= 6) {
    return actual === 6; // we don't have a 5.5 in gym yet
  } else {
    return expected === actual;
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
    ret.royal = exports.isRoyal(index, ret.route.rating);
    return ret;
  }.bind(this));
  return logs;
}

exports.calculateRoyalness = function(logRatings) {
  if (logRatings && logRatings.length) {
    return logRatings.reduce(function(total, rating, index) {
      if (exports.isRoyal(index, rating)) {
        return total + 1;
      } else {
        return total;
      }
    }, 0) / logRatings.length;
  } else {
    return 0;
  }
};
