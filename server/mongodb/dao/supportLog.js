var mongoose = require("mongoose");
var dto = reuqire("../model/SupportLog.js");

module.exports = mongoose.model(dto.name, dto.schema);
