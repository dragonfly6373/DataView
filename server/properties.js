module.exports = {
    PORT: 3000,
    BCRYPT_SALT: 10,
    MODE: "development", //"production",
    MONGODB: "mongodb://localhost:27017/chat-room",
    STATIC: "/etc/dataview/static/",

    DB_DRIVER: "org.postgresql.Driver",
    DB_USER: "postgres",
    DB_PASSWORD: "",

    SMTP_SERVER: "localhost",
    SMTP_USERNAME: "",
    SMTP_PASSWORD: "",
    SMTP_PORT: 5252
};