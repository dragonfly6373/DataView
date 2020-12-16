exports.properties = require('./properties.js');
exports.serviceBuilder = require('./lib/api/ServiceBuilder.js');
exports.SecurityUtil = require('./lib/api/SecurityUtil.js');
exports.controller = {
    user: require('./controller/user-controller')
};
