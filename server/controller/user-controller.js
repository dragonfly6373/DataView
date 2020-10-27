var db = require("../mongodb/database.js");
var User = require("../mongodb/dao/user.js");
var security = require("../service/SecurityUtil.js");

var requestAuthen = security.requestAuthen;
var session = security.session;

function testGetAll(req, callback) {
    db.find(User, {}, function(error, data) {
        if (error) callback({error: "fail to get userlist with error:" + error});
        else {
            callback({data: data});
        }
    });
}

function isRegisteredEmail(req, email, callback) {
    db.find(User, {email: email}, function(error, data) {
        if (error) {
            callback(error);
        } else {
            callback(data.length > 0);
        }
    });
}

function signup(req, data, callback) {
    db.find(User, {email: data.email}, function(error, userList) {
        if (error || userList.length > 0) {
            callback(error ? error : {error: "Your email address has already exist."});
        } else {
            db.create(User, data, function(error) {
                if (error) callback({error: error});
                else callback({message : "New User created successfully"});
            });
        }
    });
}

function login(req, email, password, callback) {
    db.find(User, {email: email, password: password}, function(error, data) {
        if (error || data.length == 0) callback({error: "Login fail! Please check your email and password and try again."});
        else {
            var userInfo = data[0];
            data[0].password = null;
            session.setCurrentLogin(req, {_id: userInfo._id, name: userInfo.name, email: userInfo.email});
            callback({user_info: userInfo});
        }
    });
}

function getUserInfo(req, callback) {
    var currentLogin = session.getCurrentLogin(req);
    if (!currentLogin) callback(false);
    db.getById(User, currentLogin._id, function(error, user) {
        if (error) callback({error: error});
        else {
            user.password = null;
            callback(user);
        }
    });
}

function updateUser(req, data, callback) {
    var currentLogin = session.getCurrentLogin(req);
    if (!currentLogin) callback(false);
    db.updateById(User, id, data, function(error, user) {
        if (error) callback({error: error});
        else {
            user.password = null;
            callback(user);
        }
    });
}

function changePassword(req, oldpass, newpass, callback) {
    var currentLogin = session.getCurrentLogin(req);
    if (!currentLogin) callback(false);
    var user = db.findOneAndUpdate(User, {_id: currentLogin._id, password: oldpass}, {$set: {password: newpass}}, function(error) {
        if (error) callback({error: error});
        else callback(true);
    });
}

function getContacts(req, callback) {
    var currentLogin = session.getCurrentLogin(req);
    if (!currentLogin) callback(false);
    db.find(Contact, {}, function(error, users) {
        if (error) callback({error: error});
        else callback({data: users});
    });
}

function deleteUser(req, id, callback) {
    var currentLogin = session.getCurrentLogin(req);
    if (!currentLogin) return false;
    // db.updateById(User, id, function(error, user) {
    //     if (error) callback({error: error});
    //     else callback(user);
    // });
}

module.exports = [
    {name: "testGetAll", method: "get", implementation: testGetAll, authentication: function(req) { return true; }},
    {name: "isRegisteredEmail", method: "get", implementation: isRegisteredEmail, authentication: function(req) { return true; }},
    {name: "signup", method: "post", implementation: signup, authentication: function(req) { return true; }},
    {name: "login", method: "post", implementation: login, authentication: function(req) { return true; }},
    {name: "getUserInfo", method: "get", implementation: getUserInfo, authentication: requestAuthen.LOGIN_REQUIRED},
    {name: "updateUser", method: "get", implementation: updateUser, authentication: requestAuthen.LOGIN_REQUIRED},
    {name: "getContacts", method: "get", implementation: getContacts, authentication: requestAuthen.LOGIN_REQUIRED},
    {name: "deleteUser", method: "get", implementation: deleteUser, authentication: requestAuthen.LOGIN_REQUIRED}
];
