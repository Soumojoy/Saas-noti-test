// backend/src/setupWidgets.js
const pool = require('./config/db');

const createWidgetTable = async () => {
  const query = `
    DROP TABLE IF EXISTS widget_configs CASCADE;

    CREATE TABLE widget_configs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        widget_key VARCHAR(100) UNIQUE NOT NULL,
        popup_text VARCHAR(255) DEFAULT '{{name}} from {{city}} bought {{product}}',
        theme_color VARCHAR(50) DEFAULT '#2563eb',
        position VARCHAR(50) DEFAULT 'bottom-left',
        delay INTEGER DEFAULT 3000,
        show_avatar BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log('✅ Widget Table created successfully!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    process.exit(0);
  }
};

createWidgetTable();