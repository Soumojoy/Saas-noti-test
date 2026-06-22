const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('❌ DB Error:', err.message);
  else console.log('☁️ 🔗 DB Connected!', res.rows[0].now);
});

module.exports = pool;