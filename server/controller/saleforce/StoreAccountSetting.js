const {DB} = require("../../lib/db");
var DataType = DB.DataType;

var AdminType = {
    ADMIN: {code: 10, name: "Admin", text: "Store Admin"},
    INVENTORY: {code: 20, name: "Inventory", text: "Inventory"},
    SALE: {code: 30, name: "Sale", text: "Sale"}
};

module.exports = {
    tablename:"store_account_setting",
    datafields: {
        id: {datatype: DataType.INT, pk: true},
        accountId: {mapping: "account_id", datatype: DataType.INT},
        storeId: {mapping: "store_id", datatype: DataType.INT},
        adminType: {mapping: "admin_type", datatype: DataType.INT},
        createdDate: {mapping: "created_date", datatype: DataType.DateTime},
        status: {datatype: DataType.INT},
        deleted: {datatype: DataType.INT}
    },
    constraints: [
        {
            pk: ["accountId", "storeId"],
            ref: [
                {table: Account, column: "id"},
                {table: Store, column: "id"}
            ]
        }
    ],
    AdminType: AdminType
};
