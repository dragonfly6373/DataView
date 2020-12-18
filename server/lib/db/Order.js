function Order(fieldname, asc, ignorecase, nullfirst) {
    this.alias = "_root";
    this.fieldname = fieldname;
    this.asc = asc;
    this.ignorecase = ignorecase;
    this.nullfirst = nullfirst;
    this.next = null;
}

Order.prototype.asc = function(fieldname, ignorecase, nullfirst) {
    if (!this.next) this.next = new Order(fieldname, true, ignorecase, nullfirst);
    else this.next.asc.apply(this.next, arguments);
};

Order.prototype.desc = function(fieldname, ignorecase, nullfirst) {
    if (!this.next) this.next = new Order(fieldname, false, ignorecase, nullfirst);
    else this.next.desc.apply(this.next, arguments);
};

Order.prototype.setContext = function(context) {
    this.alias = context.alias;
    if  (this.next) this.next.setContext(context);
    return this;
};

Order.prototype.build = function() {
    var str = "";
    str += (this.ignorecase ? " LOWER(" + this.alias + "." + this.fieldname + ")" : this.alias + "." + this.fieldname);
    str += (this.asc ? " ASC" : " DESC");
    str += (this.nullfirst != null ? (this.nullfirst ? " NULLS FIRST" : " NULL LAST") : "");
    if (this.next) str += ", " + this.next.build();
    return str;
};

Order.prototype.toString = function() {
    return "ORDER BY " + this.build();
};

Order.__proto__ = {
    asc: function(fieldname, ignorecase, nullfirst) {
        return new Order(fieldname, true, ignorecase, nullfirst);
    },
    desc: function(fieldname, ignorecase, nullfirst) {
        return new Order(fieldname, false, ignorecase, nullfirst);
    }
};

module.exports = Order;
