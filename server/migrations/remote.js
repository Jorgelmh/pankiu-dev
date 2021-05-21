/**
 *  =======================================
 *        MYSQL MIGRATION TO REMOTE DB
 *  =======================================
 */
const mysql = require("mysql2");
const migration = require("mysql-migrations");

/* Create connection */
const conn = mysql.createPool({
  connectionLimit: 10,
  user: "aFCNllsdhl",
  password: "Lx1J1p7lUV",
  database: "aFCNllsdhl",
  host: "remotemysql.com",
  port: "3306",
});

migration.init(conn, __dirname + "/");
