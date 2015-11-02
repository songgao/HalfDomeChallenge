exports.Pitches = [
  "5.10b",
  "5.10b",
  "5.9",
  "5.9",
  "5.8",
  "5.8",
  "5.11b",
  "5.9",
  "5.9",
  "5.9",
  "5.9",
  "5.9",
  "5.6",
  "5.6",
  "5.5",
  "5.8",
  "5.8",
  "5.9",
  "5.9",
  "5.10b",
  "5.10b",
  "5.9",
  "5.9",
  "5.9",
  "5.9",
  "5.8",
  "5.8",
  "5.9",
  "5.9",
  "5.8",
  "5.8",
  "5.11d",
  "5.10d",
  "5.10d",
  "5.12a",
  "5.12a",
  "5.9",
  "5.11d",
  "5.8",
  "5.8"
];
exports.TotalPitches = exports.Pitches.length;

exports.Categories = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

exports.ActionTypes = {
  FB_LOGIN_CLICK : "FB_LOGIN_CLICK",
  FB_LOGOUT_CLICK : "FB_LOGOUT_CLICK",
  ME_UPDATE_CATEGORY : "ME_UPDATE_CATEGORY",
  ME_NEW_LOG : "ME_NEW_LOG",
  ME_REMOVE_LOG : "ME_REMOVE_LOG",
  ADMIN_NEW_ROUTE : "ADMIN_NEW_ROUTE",
  ADMIN_ROUTE_ENABLE : "ADMIN_ROUTE_ENABLE",
  ADMIN_ROUTE_DISABLE : "ADMIN_ROUTE_DISABLE",
  ADMIN_PENDING_APPROVE : "ADMIN_PENDING_APPROVE",
  ADMIN_PENDING_APPROVE_ALL : "ADMIN_PENDING_APPROVE_ALL",
  ADMIN_PENDING_DISCARD : "ADMIN_PENDING_DISCARD",
  REPORT_FETCH: "REPORT_FETCH",
  PEEKER_SELECT_USER : "PEEKER_SELECT_USER",
};

exports.PayloadSources = {
  SERVER_ACTION: "SERVER_ACTION",
  VIEW_ACTION: "VIEW_ACTION"
};

exports.Categories = ["Beginner", "Intermediate", "Advanced"];

exports.Ratings = {
  all: [ "rainbow", "5.6-", "5.6", "5.6+", "5.7-", "5.7", "5.7+", "5.8-", "5.8", "5.8+", "5.9-", "5.9", "5.9+", "5.10a", "5.10b", "5.10c", "5.10d", "5.11a", "5.11b", "5.11c", "5.11d", "5.12a", "5.12b", "5.12c", "5.12d", "5.13a", "5.13b", "5.13c", "5.13d",],
  "rainbow": 0,
  "5.6-"   : 1,
  "5.6"    : 2,
  "5.6+"   : 3,
  "5.7-"   : 4,
  "5.7"    : 5,
  "5.7+"   : 6,
  "5.8-"   : 7,
  "5.8"    : 8,
  "5.8+"   : 9,
  "5.9-"   : 10,
  "5.9"    : 11,
  "5.9+"   : 12,
  "5.10a"  : 13,
  "5.10b"  : 14,
  "5.10c"  : 15,
  "5.10d"  : 16,
  "5.11a"  : 17,
  "5.11b"  : 18,
  "5.11c"  : 19,
  "5.11d"  : 20,
  "5.12a"  : 21,
  "5.12b"  : 22,
  "5.12c"  : 23,
  "5.12d"  : 24,
  "5.13a"  : 25,
  "5.13b"  : 26,
  "5.13c"  : 27,
  "5.13d"  : 28,
};

exports.Tapes = [
{name: 'White',       background_color: '#ffffff', color: 'black'},
{name: 'Red',         background_color: '#ff0000', color: 'black'},
{name: 'Blue',        background_color: '#0000ff', color: 'black'},
{name: 'Green',       background_color: '#00ff00', color: 'black'},
{name: 'Yellow',      background_color: '#ffff00', color: 'black'},
{name: 'Light Blue',  background_color: '#46aac8', color: 'black'},
{name: 'Pink',        background_color: '#fa7db9', color: 'black'},
{name: 'Gray',        background_color: '#5a5d5e', color: 'black'},
{name: 'Orange',      background_color: '#ff6308', color: 'black'},
{name: 'Navy Blue',   background_color: '#002566', color: 'white'},
{name: 'Dark Green',  background_color: '#3c7051', color: 'white'},
{name: 'Purple',      background_color: '#8c2894', color: 'white'},
{name: 'Brown',       background_color: '#73463c', color: 'white'},
{name: 'Black',       background_color: '#000000', color: 'white'},
];

exports.Nats = {
  all: ['unknown', 'NATS ON', 'NATS FEET ONLY', 'NATS OFF'],
  'NATS ON':           1,
  'NATS FEET ONLY':  2,
  'NATS OFF':          3,
};

exports.Rainbow = {
  Unknown     : require('chroma-js').scale(['#B1B1B1', '#1C1C1C']), // gray
  Beginner    : require('chroma-js').scale(['#B1DF95', '#1C4A00']), // green
  Intermediate: require('chroma-js').scale(['#FFECAA', '#554200']), // yellow
  Advanced    : require('chroma-js').scale(['#FFAAAA', '#550000']), // red
  NATS_FF     : require('chroma-js').scale(['#7788AA', '#061639']), // blue
};

