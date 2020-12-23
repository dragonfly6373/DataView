
var Condition = function(operand, operator, target) {
    this.alias = "_root";
    this.operand = operand;
    this.operator = operator;
    this.target = target;
    this.queue = [];
}

Condition.prototype = {
    and: function(condition) {
        condition.setContext({alias: this.alias});
        this.queue.push({operator: " AND", condition: condition});
        return this;
    },
    or: function(condition) {
        condition.setContext({alias: this.alias});
        this.queue.push({operator: " OR", condition: condition});
        return this;
    }
};

Condition.prototype.setContext = function(context) {
    this.alias = context.alias;
    this.queue.map(queue => {
        queue.condition.setContext(context);
    });
    return this;
};

Condition.prototype.toString = function() {
    return " WHERE" + this.build();
};

Condition.prototype.build = function() {
    var queryStr = " " + (this.operand && this.operand.length ? (this.alias + "." + this.operand) : "")
                 + " " + this.operator + " "
                 + (this.target != undefined ? this.target : "");
    for (var i in this.queue) {
        var opt = this.queue[i];
        queryStr += " " + opt.operator
                 + (opt.condition.queue.length ? " (" + opt.condition.build() + ")" : " "
                 + opt.condition.build());
    }
    return queryStr;
};

Condition.__proto__ = (function() {
    function isolateDataType(data) {
        return typeof(data) != "number" ? "'" + data + "'" : data;
    }
    return {
        eq: function(name, value) {
            return new Condition(name, "=", isolateDataType(value));
        },
        eqProperty: function(name, ref) {
            return new Condition(name, "=", ref);
        },
        ne: function(name, value) {
            return new Condition(name, "!=", isolateDataType(value));
        },
        gt: function(name, value) {
            return new Condition(name, ">", isolateDataType(value));
        },
        gte: function(name, value) {
            return new Condition(name, ">=", isolateDataType(value));
        },
        lt: function(name, value) {
            return new Condition(name, "<", isolateDataType(value));
        },
        lte: function(name, value) {
            return new Condition(name, "<=", isolateDataType(value));
        },
        in: function(name, args) {
            var values = (args instanceof Array ? args.map((item) => isolateDataType(item)).join(", ") : String(args));
            return new Condition(name, "IN" + " (" + values + ")");
        },
        between: function(name, start, end) {
            var range = isolateDataType(start) + " AND " + isolateDataType(end);
            return new Condition(name, "BETWEEN", " (" + range + ")");
        },
        isNull: function(name) {
            return new Condition(name, "IS NULL", "");
        },
        isNotNull: function(name) {
            return new Condition(name, "IS NOT NULL", "");
        },
        iLike: function(name, value) {
            return new Condition(name, "LIKE", " '%" + value + "%'");
        },
        exists: function(subquery) {
            return new Condition("", "EXISTS", "(" + subquery + ")");
        },
        notExists: function(subquery) {
            return new Condition("", "NOT EXISTS", "(" + subquery + ")");
        }
    }
})();

module.exports = Condition;
