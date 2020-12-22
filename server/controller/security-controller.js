const bcrypt = require("bcrypt");
const {SessionAuthen} = require("../lib/api/SecurityUtil");
const {DB, Condition, Order} = require("../lib/db");
var DataType = DB.DataType;
const Account = require("../model/Account");

function getCurrentLogin(req, callback) {
    var currentSession = SessionAuthen.getCurrentLogin(req);
    if (!currentSession) callback(nul);
    DB.getById(Account, currentSession.id, callback);
}

var _Account = {
    tablename: "account",
    datafields: {
        id: {mapping: "rowid", datatype: DataType.INT},
        email: {datatype: DataType.TEXT},
        password: {datatype: DataType.TEXT}
    }
};

module.exports = [
    {
        name: "signIn", method: "POST",
        implementation: function(req, accountInfo, callback) {
            DB.beginTransaction(function(pool) {
                pool.count(Account, Condition.eq("email", accountInfo.email), function(count) {
                    if (count > 0) callback({error: "Account Email have already registered"});
                    else pool.insert(Account, account, function(id) {
                        callback();
                        pool.close();
                    });
                })
            });
        }
    },
    {
        name: "requestResetPassword", method: "GET",
        implementation: function(req, email, callback) {
            console.log("@@ request body: ", req.body);
            DB.getFirst(Account, Condition.eq("email", email), null, (acc) => {
                var token = "ABCDEF";
                console.log("# request token for: ", email, token);
                SessionAuthen.setToken(req, {email, token}, (data) => {
                    callback(data);
                });
            });
        }
    },
    {
        name: "resetPassword", method: "POST",
        implementation: function(req, password, retoken, callback) {
            SessionAuthen.getToken(req, acc => {
                console.log("@@@ resetPassword:", acc, retoken);
                if (acc.token != retoken) callback({code: 304, error: "incorrect token"});
                else {
                    bcrypt.hash(password, 16, (error, hash) => {
                        if (error) callback({code: 304, error: error});
                        else {
                            console.log("-->", password, hash);
                            DB.batchUpdate(Account, {password: hash}, Condition.eq("email", acc.email), callback);
                        }
                    });
                }
            });
        }
    },
    {
        name: "login", method: "POST", implementation: function(req, email, password, callback) {
            DB.getFirst(_Account, Condition.eq("email", email), null, (acc) => {
                if (!acc) {
                    callback({error: "Incorrect email or password."});
                    return;
                }
                bcrypt.compare(password, acc.password, (error, result) => {
                    if (error) callback(false);
                    else {
                        SessionAuthen.setCurrentLogin(req, acc, (error) => {
                            if (error) callback({code: 304, error: error});
                            else getCurrentLogin(req, callback);
                        });
                    }
                });
            });
        }
    }, {
        name: "getCurrentLogin", method: "GET",
        implementation: getCurrentLogin
    }, {
        name: "logout", method: "GET", implementation: (req, callback) => {
            req.session.destroy(error => {
                if (error) callback({error: error});
                else callback(true);
            });
        }
    }
];
