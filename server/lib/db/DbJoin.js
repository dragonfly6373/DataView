function DbJoin(jointype, model, alias) {
    this.joinType = jointype;
    this.model = model;
    this.alias = alias || model.tablename;
    this.condition = [];
}
DbJoin.JoinType = {
    LEFT: "LEFT JOIN",
    RIGHT: "RIGHT JOIN",
    INNER: "INNER JOIN",
    OUTER: "OUTTER JOIN"
}

DbJoin.prototype.as = function(alias) {
    this.alias = alias;
    return this;
};

DbJoin.prototype.on = function(condition) {
    this.condition = condition;
    return this;
};

DbJoin.prototype.toString = function() {
    return " " + this.joinType + " " + this.model.tablename + " AS " + this.alias + " ON " + this.condition.build();
};

function createJoin(joinType) {
    return (function(model, alias) {
        return new DbJoin(joinType, model, alias);
    });
}

module.exports = {
    leftJoin: createJoin(DbJoin.JoinType.LEFT),
    rightJoin: createJoin(DbJoin.JoinType.RIGHT),
    outerJoin: createJoin(DbJoin.JoinType.OUTTER),
    innerJoin: createJoin(DbJoin.JoinType.INNER)
};
