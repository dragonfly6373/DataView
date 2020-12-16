var express = require('express');
var webapp = express();
var path = require('path');
var http = require('http').createServer(webapp);
var cookieParser = require('cookie-parser');
var session = require('express-session')({secret: 'secret_is_secret', cookie: {maxAge: 3600000}});

var {properties, serviceBuilder, controller} = require('server');

webapp.use(cookieParser());
webapp.use(session);
webapp.use(express.json());
webapp.use(express.static(path.join(__dirname, 'web')));

webapp.get('/', (req, res, next) => {
	res.sendFile(path.join(__dirname, '/web/index.html'));
});

// - Start APIs declaration - //
var userApi = express.Router();
webapp.use('/userService', userApi);
serviceBuilder.register('userService', userApi, controller.user);

webapp.get('/registry.js', (req, res) => {
	res.send("window._registry = " + JSON.stringify(serviceBuilder.getAPIs()) + ";\nCommonNet.initServices(window._registry);");
});
// - End APIs declaration - //

http.listen(properties.PORT, () => {
	console.log("server is starting on http://127.0.0.1:" + properties.PORT);
});

