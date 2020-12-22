const {DB} = require("../../lib/db");
var DataType = DB.DataType;

const Account = require("../Account");
const Store = require("../Store");
const Size = require("./Size");
const Variant = require("./Variant");

var Status = {
    AVAILABLE: {code: 10, name: "Available"},
    OUT_OF_STOCK: {code: 20, name: "Out of Stock"},
    COMMING_SOON: {code: 30, name: "Comming Soon"}
};
var Condition = {
    NEW: {code: 10, name: "New"},
    USED: {code: 20, name: "Used"},
    SECOND: {code: 30, name: "Secondhand"},
    REFURBISHED: {code: 40, name: "Refurbished"}
};
var ProductItem = {
    tablename: "sale_product_item",
    datafields: {
        id: {mapping: "rowid", datatype: DataType.INT, pk: true},
        name: {datatype: DataType.TEXT},
        descr: {datatype: DataType.TEXT},
        storeId: {maping: "store_id", datatype: DataType.INT},
        sizeId: {mapping: "size_id", datatype: DataType.INT},
        variantId: {mapping: "variant_id", datatype: DataType.INT},
        createdDate: {mapping: "created_date", datatype: DataType.DATETIME},
        published: {datatype: DataType.BOOLEAN},
        status: {datatype: DataType.INT},
        condition: {datatypey: DataType.INT},
        accountId: {mapping: "account_id", datatype: DataType.INT},
        deleted: {datatype: DataType.INT},
    },
    constraints: [
        {fk: "store_id", ref: {table: Store, column: "rowid"}},
        {fk: "size_id", ref: {table: Size, column: "rowid"}},
        {fk: "variant_id", ref: {table: Variant, column: "rowid"}},
        {fk: "account_id", ref: {table: Account, column: "rowid"}}
    ],
    Status: Status,
    Condition: Condition
};

module.exports = ProductItem;
