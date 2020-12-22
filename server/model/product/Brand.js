const {DB} = require("../../lib/db");
var DataType = DB.DataType;
const Account = require("../Account");

var Brand = {
    tablename: "brand",
    datafields: {
        id: {mapping: "rowid", datatype: DataType.INT},
        name: {datatype: DataType.TEXT},
        descr: {datatype: DataType.TEXT},
        accountId: {mapping: "account_id", datatype: DataType.INT},
        createdDate: {mapping: "created_date", datatype: DataType.DATETIME}
    }
}

Brand.constraints = [
    {fk: "parent_id", ref: {table: Brand, column: "rowid"}},
    {fk: "account_id", ref: {table: Account, column: "rowid"}}
];

module.exports = Brand;
