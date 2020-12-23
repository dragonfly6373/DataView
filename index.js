var express = require('express');
var webapp = express();
var path = require('path');
var http = require('http').createServer(webapp);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')({secret: 'secret_is_secret', cookie: {maxAge: 3600000}});

var {properties, serviceBuilder, controllers} = require('server');

webapp.use(cookieParser());
webapp.use(session);
webapp.use(bodyParser.urlencoded({ extended: false }));
webapp.use(bodyParser.json());
webapp.use(express.static(path.join(__dirname, 'web')));

webapp.get('/', (req, res, next) => {
	res.sendFile(path.join(__dirname, '/web/index.html'));
});

// serviceBuilder.load(webapp, express.Router, controllers);

controllers.map(c => {
    var router = express.Router();
    webapp.use("/" + c.name, router);
    return {api_name: c.name, router: router, controllers: c.controllers};
}).forEach(c => {
    serviceBuilder.register(c.api_name, c.router, c.controllers);
});

/* - Start APIs declaration - */
// var userApi = express.Router();
// webapp.use('/userService', userApi);
// serviceBuilder.register('userService', userApi, controller.user);

webapp.get('/registry.js', (req, res) => {
	res.send("window._registry = " + JSON.stringify(serviceBuilder.getAPIs()) + ";\nCommonNet.initServices(window._registry);");
});
// - End APIs declaration - //

http.listen(properties.PORT, () => {
	console.log("server is starting on http://127.0.0.1:" + properties.PORT);
});

