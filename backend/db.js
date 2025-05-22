// db.js
const { Pool } = require('pg');
require('dotenv').config();

// Используем строку подключения из .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Supabase требует SSL, но без строгой проверки
  },
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};