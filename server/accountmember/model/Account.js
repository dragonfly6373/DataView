var {DB} = require('db');
var DataType = DB.DataType;

var Account = {
    tablename: "account",
    columns: [
        {name: "id", datatype: DataType.INT, pk: true},
        {name: "name", datatype: DataType.TEXT},
        {name: "email", datatype: DataType.TEXT},
        {name: "sex", datatype: DataType.INT},
        {name: "status", datatype: DataType.INT}
    ]
}

module.exports = Account;