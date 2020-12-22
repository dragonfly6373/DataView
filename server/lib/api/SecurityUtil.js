
var SessionAuthen = {
    getToken: function(req, callback) {
        if (req.session) {
            var token = req.session["TOKEN"];
            if (callback) callback(token);
            else return token;
        }
    },
    setToken: function(req, token, callback) {
        // req.session.generate(err => {
        //     if (err) callback({error: err});
        //     else {
                req.session["TOKEN"] = token;
                callback(true);
        //     }
        // });
    },
    getCurrentLogin: function(req, callback) {
        if (!req.session) return null;
        console.log("[SESSION] check current_login:", req.sessionID, req.session["CURRENT_LOGIN"]);
        var acc = req.session["CURRENT_LOGIN"];
        if (callback) callback(acc);
        else return acc;
    },
    setCurrentLogin: function(req, userInfo, callback) {
        // console.log("[SESSION] set current_login:", userInfo);
        // req.session.generate(err => {
        //     if (err) callback({error: err});
        //     else {
                req.session["CURRENT_LOGIN"] = userInfo;
                callback(userInfo);
        //     }
        // });
    }
};

var RequestAuthen = (function() {
    return {
        LOGIN_REQUIRED: function(req) {
            var currentLogin = session.getCurrentLogin(req);
            if (!currentLogin) return false;
            return true;
        },
        SYSTEM_ADMIN: function(req) {
            var userInfo = sessionAuthen.getCurrentLogin(req);
            if (userInfo && userInfo.userRole == "admin") return true;
            return false;
        },
        accountRequireRole: function(minimumRole) {
            return function(req) {
                var userInfo = sessionAuthen.getCurrentLogin(req);
                return (userInfo.userRole >= minimumRole);
            };
        }
    };
})();

module.exports.SessionAuthen = SessionAuthen;
module.exports.RequestAuthen = RequestAuthen;
