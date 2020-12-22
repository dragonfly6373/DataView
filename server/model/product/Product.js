const {DB} = require("../../lib/db");
var DataType = DB.DataType;

const Account = require("../Account");
const Store = require("../Store");
const Brand = require("./Brand");
const Category = require("./Category");

var Status = {
    AVAILABLE: {code: 10, name: "Available"},
    OUT_OF_STOCK: {code: 20, name: "Out of Stock"},
    COMMING_SOON: {code: 30, name: "Comming Soon"}
};
var Product = {
    tablename: "sale_product",
    datafields: {
        id: {mapping: "rowid", datatype: DataType.INT, pk: true},
        name: {datatype: DataType.TEXT},
        storeId: {maping: "store_id", datatype: DataType.INT},
        categoryId: {mapping: "category_id", datatype: DataType.INT},
        brandId: {mapping: "brandId", datatype: DataType.INT},
        createdDate: {mapping: "created_date", datatype: DataType.DATETIME},
        published: {datatype: DataType.BOOLEAN},
        status: {datatype: DataType.INT},
        accountId: {mapping: "account_id", datatype: DataType.INT},
        deleted: {datatype: DataType.INT},
    },
    constraints: [
        {fk: "store_id", ref: {table: Store, column: "rowid"}},
        {fk: "category_id", ref: {table: Category, column: "rowid"}},
        {fk: "brand_id", ref: {table: Brand, column: "rowid"}},
        {fk: "account_id", ref: {table: Account, column: "rowid"}}
    ]
};

module.exports = Product;
