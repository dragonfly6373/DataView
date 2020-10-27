var express = require('express');
var app = express();
var path = require('path');
var http = require('http').createServer(app);
var cookieParser = require('cookie-parser');
var session = require('express-session')({secret: 'secret_is_secret', cookie: {maxAge: 3600000}});
// var redisAdapter = require('socket.io-redis');
var sharedSession = require('express-socket.io-session');
var io = require('socket.io')(http);

var CONTEXT = require('server');
var properties = CONTEXT.properties;

var db = CONTEXT.mongodb;
var serviceBuilder = CONTEXT.serviceBuilder;

var controller = CONTEXT.controller;
var userController = controller.user;
var chatController = controller.chat;

db.connect();

app.use(cookieParser());
app.use(session);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'WebContent/public')));

app.get('/', (req, res, next) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

io.use(sharedSession(session));
var socketIO = CONTEXT.socketIO;
socketIO.start(io);

// - Start APIs declaration - //
var userApi = express.Router();
app.use('/userService', userApi);
serviceBuilder.register('userService', userApi, userController);

var chatApi = express.Router();
app.use('/chatService', chatApi);
serviceBuilder.register('chatService', chatApi, chatController);

app.get('/registry.js', (req, res) => {
	res.send("window._registry = " + JSON.stringify(serviceBuilder.getAPIs()) + ";\nCommonNet.initServices(window._registry);");
});
// - End APIs declaration - //

app.use(function(req, res, next) {
	res.status(404).send("Oop! Page not be found");
});

app.use(function(req, res, next) {
	res.status(401).send("Oop! Authentication required");
});

http.listen(properties.PORT, () => {
	console.log("server is starting on http://127.0.0.1:" + properties.PORT);
});

