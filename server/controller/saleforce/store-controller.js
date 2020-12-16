var {DB, Condition, Order} = require("../lib/db");
var User = require("../model/User");
var security = require("../lib/service/SecurityUtil");

var requestAuthen = security.requestAuthen;
var session = security.session;

function getAll(req, callback) {
    DB.getAll(User, null, null, callback);
}

function getById(req, id, callback) {
    DB.getById(User, id, callback);
}

module.exports = [
    {name: "getAll", method: "GET", implementation: getAll, authentication: function(req) { return true; }},
    {name: "getById", method: "GET", implementation: getById}
];
