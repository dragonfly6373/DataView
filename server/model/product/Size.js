const {DB} = require("../../lib/db");
var DataType = DB.DataType;

const Account = require("../Account");

var Size = {
    tablename: "sale_category",
    datafields: {
        id: {mapping: "rowid", datatype: DataType.INT},
        name: {datatype: DataType.TEXT},
        descr: {datatype: DataType.TEXT},
        accountId: {mapping: "account_id", datatype: DataType.INT},
        createdDate: {mapping: "created_date", datatype: DataType.DATETIME}
    },
    constraints: [
        {fk: "account_id", ref: {table: Account, column: "rowid"}}
    ]
};

module.exports = Size;
