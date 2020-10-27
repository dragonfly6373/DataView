var SecurityUtil = require("./service/SecurityUtil.js");
var ChatService = (function() {
    var _rooms = [];

    var Event = {
        EVT_CONNECT: "connection",
        EVT_MESSAGE: "message",
        EVT_DISCONNECT: "disconnect",
        EVT_WELCOME: "welcome",
        EVT_HELLO: "hello",
        EVT_REQUEST_ROOM: "request_room",
        EVT_ROOM_JOIN: "room_accept",
        EVT_LEAVE: "leave",
    };

    function _getUserInfo() {
        return SecurityUtil.session.getCurrentLogin(this.handshake);
    }
    function onConnect(message) {
        console.log("# socket onConnect", (this._currentLogin ? this._currentLogin.name : ""));
        this.emit(Event.EVT_CONNECT, "");
    }
    function onJoin(message) {
        console.log("# socket join", (this._currentLogin ? this._currentLogin.name : ""));
        this._rooms.push(room);
        this.join(room);
        this.in(room).emit(Event.EVT_JOIN, {user_info: this._currentLogin})
        this.server.emit(Event.EVT_JOIN, {user_info: this._currentLogin});
    }
    function onMessage(message) {
        console.log("# socket onMessage", message, (this._currentLogin ? this._currentLogin.name : ""));
        this.server.emit(Event.EVT_MESSAGE, {user_info: _getUserInfo.call(this), message: message});
    }
    function leaveRoom(room_id) {
        if (!this._rooms[room_id]) return;
        this.leave(room_id);
        delete(this._rooms[room_id]);
    }
    function onDisconnect() {
        console.log("# socket onDisconnect", (this._currentLogin ? this._currentLogin.name : ""));
        this.server.emit(Event.EVT_DISCONNECT, {user_info: _getUserInfo.call(this)});
        this.disconnect(true);
    }
    return {
        start: function(io) {
            io.on(Event.EVT_CONNECT, function(socket) {
                console.log("# socket authorization");
                var currentLogin = _getUserInfo.call(socket);
                if (!currentLogin) {
                    console.warn("[SPAM] no-authorize user", currentLogin);
                    socket.disconnect();
                    return;
                }
                socket._currentLogin = currentLogin;
                socket.emit(Event.EVT_WELCOME, {account_info: currentLogin});
                socket.on(Event.EVT_HELLO, onJoin.bind(socket));
                socket.on(Event.EVT_MESSAGE, onMessage.bind(socket));
                socket.on(Event.EVT_REFRESH, onRefresh.bind(socket));
                socket.on(Event.EVT_LEAVE, onLeave.bind(socket));
                socket.on(Event.EVT_DISCONNECT, onDisconnect.bind(socket));
            });
        }
    };
})();

ChatService.BaseRoom = function (socket) {

};

ChatService.ServiceRoom = function(socket) {
    BaseRoom.call(this);
};

ChatService.PrivateRoom = function(socket) {
    BaseRoom.call(this);
};

