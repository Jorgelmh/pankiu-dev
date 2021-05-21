/**
 *  ==================================
 *      MYSQL DATABASE MIGRATION
 *  ==================================
 *
 */

/* Load env variables */
require("../config/config");
const mysql = require("mysql2");
const migration = require("mysql-migrations");

/* Create connection */
const conn = mysql.createPool({
  connectionLimit: 10,
  user: process.env.dbuser,
  password: process.env.dbpassword,
  database: process.env.dbname,
  port: process.env.dbport,
});

migration.init(conn, __dirname + "/");
