module.exports = {
    Account: require("./Account"),
    Location: require("./Location"),
    Member: require("./Member"),
    Store: require("./Store"),

    Product: require("./product/Product"),
    ProductItem: require("./product/ProductItem"),
    ProductBrand: require("./product/Brand"),
    ProductCategory: require("./product/Category"),
    ProductSize: require("./product/Size"),
    ProductVariant: require("./product/Variant"),

    SaleCart: require("./sales/Cart"),
    SaleCartItem: require("./sales/CartItem"),
    SaleInventory: require("./sales/Inventory"),
    SaleInventoryItem: require("./sales/InventoryItem"),
    SaleInventoryOrder: require("./sales/InventoryOrder"),
    SaleOrder: require("./sales/Order"),
    SaleOrderItem: require("./sales/OrderItem")
};
