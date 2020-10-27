var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports.name = "chat_log";

module.exports.schema = new Schema({
    parent_id: {type: Number},
    request_id: {type: Number},
    action: {type: Number},
    text: {type: String},
    send_time: {type: Date, default: Date.now},
    emoticon: {type: String}
});