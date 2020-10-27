var chatController = require('../controller/chat-controller.js');
var USER_ROLES = require('../mongodb/model/User.js').USER_ROLES;

var session = {
    getCurrentLogin: function(req) {
        if (!req.session) return null;
        console.log("[SESSION] check current_login:", req.sessionID, req.session["CURRENT_LOGIN"]);
        return req.session["CURRENT_LOGIN"];
    },
    setCurrentLogin: function(req, userInfo) {
        console.log("[SESSION] set current_login:", userInfo);
        req.session["CURRENT_LOGIN"] = userInfo;
    }
};

var requestAuthen = (function() {
    return {
        LOGIN_REQUIRED: function(req) {
            var currentLogin = session.getCurrentLogin(req);
            if (!currentLogin) return false;
            return true;
        },
        SYSTEM_ADMIN: function(req) {
            var userInfo = session.getCurrentLogin(req);
            if (userInfo && userInfo.userRole == USER_ROLES.ADMIN) return true;
            return false;
        },
        accountRequireRole: function(minimumRole) {
            return function(req) {
                var userInfo = session.getCurrentLogin(req);
                return (userInfo.userRole >= minimumRole);
            };
        },
        roomRequireRole: function(room_id, minimumRole) {
            return function(req) {
                var userInfo = session.getCurrentLogin(req);
                var isRoomAdmin = new Promise(function(resolve, reject) {
                    chatController.getGroupInfo.implementation.apply(null, room_id, function(error, data) {
                        if (error) reject();
                        else if (data.roomAdmin.id == userInfo.id) {
                            resolve(true);
                        } else {
                            reject();
                        }
                    });
                });
                return isRoomAdmin;
            };
        }
    };
})();

module.exports.session = session;
module.exports.requestAuthen = requestAuthen;
module.exports.USER_ROLES = USER_ROLES;
