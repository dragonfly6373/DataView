var {DB, Condition, Order} = require("../../lib/db");
var security = require("../../lib/api/SecurityUtil");

var {Account, Store, Location} = require("../../model");

var requestAuthen = security.requestAuthen;
var sessionAuthen = security.sessionAuthen;

var createStore = {
    name: "createStore", method: "GET",
    implementation: function(req, store, callback) {
        DB.insert(Store, callback);
    }
};
var createAccount = {
    name: "createAccount", method: "GET",
    implementation: function(req, account, callback) {
        DB.insert(Account, account, callback);
    }
};
var getAllStore = {
    name: "getAllStore", method: "GET",
    implementation: function(req, callback) {
        DB.getAll(Store, null, null, callback);
    }
};
var getStoreDetailById = {
    name: "getStoreDetailById", method: "GET", 
    implementation: function(req, id, callback) {
        DB.getById(Store, id, callback);
    }
};
var updateStore = {
    name: "updateStore", method: "GET",
    implementation: function(req, store, callback) {
        DB.beginTransaction((pool) => {
            pool.getById(Store, store.id, (data) => {
                data = {...data, ...store};
                data.updatedDate = new Date();
                pool.update(Store, data, () => {
                    if (callback) callback();
                    pool.close();
                });
            });
        });
    }
};
var getAllAccount = {
    name: "getAllAccount", method: "GET",
    implementation: function(req, callback) {
        DB.getAll(Account, null, null, callback);
    }
};
var getAccountById = {
    name: "getAccountById", method: "GET", 
    implementation: function(req, id, callback) {
        DB.getById(Account, id, callback);
    }
};
var updateAccount = {
    name: "updateAccount", method: "GET",
    implementation: function(req, acc, callback) {
        DB.beginTransaction((pool) => {
            pool.getById(Account, acc.id, (data) => {
                data = {...data, ...acc};
                data.updatedDate = new Date();
                pool.update(Account, data, () => {
                    if (callback) callback();
                    pool.close();
                });
            });
        });
    }
};

module.exports = [
    createStore, createAccount, getAllStore, getStoreDetailById,
    updateStore, getAllAccount, getAccountById, updateAccount
];
