var SecurityUtil = require("./service/SecurityUtil.js");
var Event = {
	EVT_CONNECT: "connect",
	EVT_OPEN: "open",
	EVT_JOIN: "join",
	EVT_MESSAGE: "message",
	EVT_REFRESH: "refresh",
	EVT_LEAVE: "leave",
	EVT_DISCONNECT: "disconnect"
};

var SocketServer = (function() {
	var _namespace = {};
	var _group = {};
	var _session = {};
	function getUserInfo() {
		return SecurityUtil.session.getCurrentLogin(this.handshake);
	}
	function onConnect(message) {
		console.log("# socket onConnect", (this._currentLogin ? this._currentLogin.name : ""));
		this.emit(Event.EVT_CONNECT, "");
	}
	function onJoin(message) {
		console.log("# socket join", (this._currentLogin ? this._currentLogin.name : ""));
		this.server.emit(Event.EVT_JOIN, {user_info: this._currentLogin});
	}
	function onMessage(message) {
		console.log("# socket onMessage", message, (this._currentLogin ? this._currentLogin.name : ""));
		this.server.emit(Event.EVT_MESSAGE, {user_info: getUserInfo.call(this), message: message});
	}
	function onRefresh() {
		console.log("# socket onRefresh", (this._currentLogin ? this._currentLogin.name : ""));
		this.close();
	}
	function onLeave(message) {
		console.log("# socket message", (this._currentLogin ? this._currentLogin.name : ""));
		this.server.emit(Event.EVT_LEAVE, {user_info: getUserInfo.call(this)});
	}
	function onDisconnect() {
		console.log("# socket onDisconnect", (this._currentLogin ? this._currentLogin.name : ""));
		this.server.emit(Event.EVT_DISCONNECT, {user_info: getUserInfo.call(this)});
		this.disconnect(true);
		// this.close();
	}
	return {
		start: function(io) {
			io.on(Event.EVT_CONNECT, function(socket) {
				console.log("# socket authorization");
				var currentLogin = getUserInfo.call(socket);
				if (!currentLogin) {
					console.warn("[SPAM] no-authorize user", currentLogin);
					socket.disconnect();
					return;
				}
				socket._currentLogin = currentLogin;
				socket.emit(Event.EVT_OPEN, {account_info: currentLogin});
				socket.on(Event.EVT_JOIN, onJoin.bind(socket));
				socket.on(Event.EVT_MESSAGE, onMessage.bind(socket));
				socket.on(Event.EVT_REFRESH, onRefresh.bind(socket));
				socket.on(Event.EVT_LEAVE, onLeave.bind(socket));
				socket.on(Event.EVT_DISCONNECT, onDisconnect.bind(socket));
			});
		}
	};
})();

module.exports = SocketServer;
