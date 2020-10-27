var db = require("../mongodb/database.js");
var User = require("../mongodb/dao/user.js");
var Room = require("../mongodb/dao/room.js");

function requestSupport(req, roomName, callback) {

}

module.exports = [
    {name: "requsetSupport", method: "GET", implementation: requestSupport, authentication: function(req) {return true;}}
];
