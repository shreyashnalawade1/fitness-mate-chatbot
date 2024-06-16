const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: {
    // Enable SSL encryption
    rejectUnauthorized: false, // Ignore SSL certificate validation (for development/testing only)
  },
});

module.exports=pool;