var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Gender = { Female: 0, Male: 1, Unknown: 2 };
var USER_ROLES = {ADMIN: 90, MEMBER: 10, NOT_LOGIN: 0};

module.exports.name = "contact";

module.exports.schema = new Schema({
    user_id: {type: Number},
    contact_id: {type: Number}, // could be an another user_id, or fake user_id for group chat
    name: { type: String, required: true },
    created_date: {
        type: Date,
        default: Date.now
    },
    deleted: {type: Boolean, default: false}
});
