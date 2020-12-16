
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
            if (userInfo && userInfo.userRole == "admin") return true;
            return false;
        },
        accountRequireRole: function(minimumRole) {
            return function(req) {
                var userInfo = session.getCurrentLogin(req);
                return (userInfo.userRole >= minimumRole);
            };
        }
    };
})();

module.exports.session = session;
module.exports.requestAuthen = requestAuthen;
