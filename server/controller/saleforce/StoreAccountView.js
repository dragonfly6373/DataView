const {DB, DbJoin} = require("../lib/db");
var DataType = DB.DataType;

var Account = require("../../model/Account");
var Store = require("../../model/Store");
var StoreAccountSetting = require("./StoreAccountSetting");

module.exports = {
    tablename:"store_account_setting",
    nativejoin: [
        DbJoin.LEFT(Account, "acc").ON(Condition.eqProperty("account_id", "acc.id")),
        DbJoin.LEFT(Store, "store").ON(Condition.eqProperty("store_id", "store.id"))
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
