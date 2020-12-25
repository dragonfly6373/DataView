const {DB, DbJoin} = require("db");
var DataType = DB.DataType;

var {Account, Store} = require("model");
var StoreAccountSetting = require("./StoreAccountSetting");

module.exports = {
    tablename:"store_account_setting",
    joins: [
        DbJoin.leftJoin(Account, "acc").on(Condition.eqProperty("account_id", "acc.id")),
        DbJoin.leftJoin(Store, "store").on(Condition.eqProperty("store_id", "store.id"))
    ],
    datafields: {
        ...StoreAccountSetting.datafields,
        accountName: {mapping: "acc.name", datatype: DataType.TEXT},
        storeName: {mapping: "store.name", datatype: DataType.TEXT},
        storeAddress: {mapping: "store.address", datatype: DataType.TEXT},
        storeStatus: {mapping: "store.status", datatype: DataType.TEXT}
    },
    without_rowid: true
};
