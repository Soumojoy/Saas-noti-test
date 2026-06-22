const pool = require('./config/db');

const createTables = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        store_name VARCHAR(255),
        domain VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(queryText);
    console.log('✅ Tables created successfully!');
  } catch (err) {
    console.error('❌ Error creating tables:', err.message);
  } finally {
    process.exit(0);
  }
};

createTables();