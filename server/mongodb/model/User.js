var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Gender = { Female: 0, Male: 1, Unknown: 2 };
var USER_ROLES = {ADMIN: 90, MEMBER: 10, NOT_LOGIN: 0};

module.exports.name = "user";
module.exports.USER_ROLES = USER_ROLES;
module.exports.Gender = Gender;

module.exports.schema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
    password: { type: String, required: true },
	gender: { type: Number, default: Gender.Female },
    user_role: { type: Number, default: USER_ROLES.MEMBER },
	created_date: {
		type: Date,
		default: Date.now
	},
	deleted: {type: Boolean, default: false}
});
