const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection safely
pool.connect()
  .then(() => {
    console.log("Connected to Neon PostgreSQL");
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });

// Prevent app crash if DB disconnects
pool.on("error", (err) => {
  console.error("Unexpected database error:", err.message);
});

module.exports = pool;