var Model = (function() {
    return {
        User: {
            tablename:"user",
            datafields: [
                {fieldname: "id", datatype: DataType.INT, pk: true},
                {name: "name", datatype: DataType.TEXT},
                {name: "email", datatype: DataType.TEXT},
                {name: "sex", datatype: DataType.INT},
                {name: "status", datatype: DataType.INT}
            ]
        }
    };
})();

module.exports = Model;
