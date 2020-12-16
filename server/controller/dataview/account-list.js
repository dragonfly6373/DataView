var model = require("../../accountmember/model/Account");

module.exports = function(model, condition, summary) {
    displayName: "XYZ",
    dataClassName: model,
    conditionBuilder: condition,
    summaryClassName: summary,
    columns: [
        {
            title: "Name",
            fieldName: "name",
            sortable: true,
            sizing: "1*,14em",
            removable: false,
            visible: true,
            type: "String"
        },
        {
            title: "Gender",
            fieldName: "sex",
            sortable: true,
            sizing: "8em",
            removable: true,
            type: "Boolean",
            transform: (value) => (value ? "Female" : "Male")
        },
        {
            title: "Age",
            fieldName: "dt_dob",
            sortable: true,
            sizing: "8em",
            removable: true,
            type: "Date",
            transform: (date) => {
                var age = new Date().getYear() - date.getYear();
                age += (new Date().getMonth() > date.getMonth() ? -1 : (new Date().getDate() > date.getDate() ? -1 : 0))
                return age;
            }
        },
        {
            title: "Email",
            fieldname: "email",
            sortable: false,
            sizing: "14",
            removable: "false",
            type: "String"
        },
        {
            title: "Member",
            fieldName: "member",
            sortable: false,
            removable: false,
            type: "Array"
        }
    ],
    filters: [
        {
            title: "Text filter",
            fieldName: "title",
            group: "groupName",
            display: "topmost" | "instance" | "hidden",
            filterType: "input_text" | "input_number" | "input_email" | "input_date" | "select" | "checkbox" | "slider" | "slider_range" | "custom",
            multipleSelect: true,
            range: [from, to, step],
            values: [],
            valuesProvider: {
                api: "$classAdminService.classFilterValueProvider",
                params: ["paramName", "programId", "subProgId"]
            }
        }
    ]
};
