exports.properties = require('./properties.js');

exports.serviceBuilder = require('./lib/api/ServiceBuilder.js');
exports.SecurityUtil = require('./lib/api/SecurityUtil.js');

exports.controllers = [
    {name: "securityService", controllers: require("./controller/security-controller")},
    {name: "storeService", controllers: require("./controller/saleforce/store-controller")},
    {name: "saleService", controllers: require("./controller/saleforce/sale-controller")}
];
