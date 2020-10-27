var Model = (function() {
    return {
        User: {
            tablename:"user",
            columns: [
                {fieldname: "id", datatype: DataType.INT, pk: true},
                {name: "name", datatype: DataType.TEXT},
                {name: "email", datatype: DataType.TEXT},
                {name: "sex", datatype: DataType.INT},
                {name: "status", datatype: DataType.INT}
            ]
        }
    };
})();
