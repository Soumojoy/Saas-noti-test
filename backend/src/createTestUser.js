const bcrypt = require('bcrypt');
const crypto = require('crypto');
const pool = require('./config/db');

const run = async () => {
  try {
    const email = 'test@example.com';
    const password = 'password123';
    
    // Check if user exists
    let userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let userId;
    
    if (userResult.rows.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const insertUser = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
        ['Test Store Owner', email, hashedPassword]
      );
      userId = insertUser.rows[0].id;
      console.log('✅ User registered successfully. User ID:', userId);
    } else {
      userId = userResult.rows[0].id;
      console.log('ℹ️ User already exists. User ID:', userId);
    }
    
    // Check if config exists
    let configResult = await pool.query('SELECT * FROM widget_configs WHERE user_id = $1', [userId]);
    let widgetKey;
    
    if (configResult.rows.length === 0) {
      widgetKey = crypto.randomUUID();
      const insertConfig = await pool.query(
        'INSERT INTO widget_configs (user_id, widget_key) VALUES ($1, $2) RETURNING widget_key',
        [userId, widgetKey]
      );
      widgetKey = insertConfig.rows[0].widget_key;
      console.log('✅ Widget config created. Widget Key:', widgetKey);
    } else {
      widgetKey = configResult.rows[0].widget_key;
      console.log('ℹ️ Widget config already exists. Widget Key:', widgetKey);
    }
  } catch (err) {
    console.error('❌ Error creating test user/config:', err.message);
  } finally {
    process.exit(0);
  }
};

run();
