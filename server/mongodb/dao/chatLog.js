var mongoose = require("mongoose");
var dto = require("../model/ChatLog.js");

module.exports = mongoose.model(dto.name, dto.schema);
