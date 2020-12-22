const {DB} = require("../../lib/db");
var DataType = DB.DataType;

var OrderItem = {
    tablename: "sale_order_item",
    datafields: {
        id: {mapping: "rowid", datatype: DataType.INT}

    }
};

module.exports = OrderItem;