const {DB, DbJoin} = require("../lib/db");
var DataType = DB.DataType;

var Account = require("../../model/Account");
var Store = require("../../model/Store");

module.exports = {
    tablename:"store_account_setting",
    nativejoin: [
        DbJoin.LEFT(Account, "acc").ON(Condition.eqProperty("account_id", "acc.id")),
        DbJoin.LEFT(Store, "store").ON(Condition.eqProperty("store_id", "store.id"))
    ],
    datafields: {
        id: {datatype: DataType.INT, pk: true},
        accountId: {mapping: "account_id", datatype: DataType.INT},
        storeId: {mapping: "store_id", datatype: DataType.INT},
        adminType: {mapping: "admin_type", datatype: DataType.INT},
        createdDate: {mapping: "created_date", datatype: DataType.DateTime},
        status: {datatype: DataType.INT},
        deleted: {datatype: DataType.INT}
    }
};
