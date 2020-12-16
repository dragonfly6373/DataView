const {DB} = require("../../lib/db");
var DataType = DB.DataType;

var AccountType = {
    ADMIN: {code: 10, name: "Admin", text: "Store Admin"},
    INVENTORY: {code: 20, name: "Inventory", text: "Inventory"},
    SALE: {code: 30, name: "Sale", text: "Sale"}
};
var AccountStatus = {
    ACTIVE: {code: 10, name: "Active"},
    PENDDING: {code: 20, name: "Pendding"},
    SUSPEND: {code: 30, name: "Suspend"}
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
    AccountType: AccountType,
    AccountStatus: AccountStatus
};
