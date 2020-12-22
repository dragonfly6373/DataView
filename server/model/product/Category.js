const {DB} = require("../../lib/db");
var DataType = DB.DataType;

const Account = require("../Account");

var Category = {
    tablename: "category",
    datafields: {
        id: {mapping: "rowid", datatype: DataType.INT},
        name: {datatype: DataType.TEXT},
        descr: {datatype: DataType.TEXT},
        parentId: {mapping: "parent_id", datatype: DataType.INT},
        accountId: {mapping: "account_id", datatype: DataType.INT},
        createdDate: {mapping: "created_date", datatype: DataType.DATETIME}
    }
}

Category.constraints = [
    {fk: "parent_id", ref: {table: Category, column: "rowid"}},
    {fk: "account_id", ref: {table: Account, column: "rowid"}}
];

module.exports = Category;
