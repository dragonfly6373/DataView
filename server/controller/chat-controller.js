var db = require("../mongodb/database.js");
var User = require("../mongodb/dao/user.js");
var Room = require("../mongodb/dao/room.js");

function createRoom(req, data, callback) {
    db.create(Room, data, function(error) {
        if (error) callback({error: error});
        else callback({message : "New Room created successfully"});
    });
}

function friendReques(req, id, callback) {
    
}

function joinChat(req, id, callback) {
    db.updateById(User, id, {$set: {dt_last_login: new Date()}}, function(error, user) {
        if (error) callback({error: error});
        else callback(user);
    });
}

function getGroupInfo(req, id, callback) {
    db.getById(Room, id, function(error, data) {
        if (error) callback({error: error});
        else callback(data);
    });
}

function kickUser(req, id, callback) {
    // only room admin can perform
}

function sendMessageTo(req, from, to, message, callback) {
    // log conservation history.
}

function getGroupMembers(req, groupId, callback) {
    // list all members in group
}

function searchLog(req, id, keyword, callback) {
    // search in conservation history by keyword
}

module.exports = [
    {name: "createRoom", method: "get", implementation: createRoom},
    {name: "joinChat", method: "get", implementation: joinChat},
    {name: "sendMessageTo", method: "get", implementation: sendMessageTo},
    {name: "getGroupInfo", method: "get", implementation: getGroupInfo},
    {name: "getGroupMembers", method: "get", implementation: getGroupMembers},
    {name: "searchLog", method: "get", implementation: searchLog}
];
