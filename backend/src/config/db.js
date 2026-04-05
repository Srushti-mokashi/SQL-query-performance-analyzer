const mysql = require("mysql2/promise");
require("dotenv").config();

let pool;

async function connectDB() {
  try {
    pool = mysql.createPool(process.env.DATABASE_URL);

    // Test connection
    const connection = await pool.getConnection();
    console.log("Database connected successfully");
    connection.release();

  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
}

connectDB();

module.exports = {
  query: (sql, params) => pool.query(sql, params)
};