const mysql = require("mysql2");
require("dotenv").config();

// connect WITHOUT a database selected, it creates if it doesn't exist
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 3306,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => {
  if (err) console.error("Error creating database:", err);
  else console.log(`Database '${process.env.DB_NAME}' ready`);
});

connection.end();

// create the pool with the database selected
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
  
// Create the schools table if it doesn't exist
db.query(`
  CREATE TABLE IF NOT EXISTS schools (
    id        INT PRIMARY KEY AUTO_INCREMENT,
    name      VARCHAR(255) NOT NULL,
    address   VARCHAR(500) NOT NULL,
    latitude  FLOAT        NOT NULL,
    longitude FLOAT        NOT NULL
  )
`, (err) => {
  if (err) console.error("Error creating table:", err);
  else console.log("Table 'schools' ready");
});

module.exports = db.promise();