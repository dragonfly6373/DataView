var {DB, Condition, Order} = require("../../lib/db");
var security = require("../../lib/api/SecurityUtil");

var {Account, Store, Product, ProductItem, ProductCateogry, ProductBrand, SaleOrder, SaleOrderItem} = require("../../model");

var requestAuthen = security.requestAuthen;
var sessionAuthen = security.sessionAuthen;

function getAll(req, callback) {
    DB.getAll(Store, null, null, callback);
}

function getById(req, id, callback) {
    DB.getById(Store, id, callback);
}

module.exports = [
    {name: "getAll", method: "GET", implementation: getAll, authentication: function(req) { return true; }},
    {name: "getById", method: "GET", implementation: getById}
];
