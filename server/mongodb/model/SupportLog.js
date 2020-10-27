var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports.name = "support_log";

module.exports.schema = new Schema({
    customer_id: Schema.Types.ObjectId,
    cus_name: {type: String},
    cus_email: {type: String},
    cus_mobile: {type: String},
    cus_address: {type: String},
    cus_age: {type: Number},
    cus_gender: {type: Number},
    request_time: {type: Date, default: Date.now},
    start_support_time: {type: Date, default: Date.now},
    support_by: Schema.Types.ObjectId,
    status: {type: Number},
    cus_evaluation: {type: Number}
});
