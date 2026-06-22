// backend/src/controllers/widgetController.js
const pool = require('../config/db');

// @desc    Get user's widget settings
// @route   GET /api/widgets/config
const getWidgetConfig = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if config exists
    let result = await pool.query('SELECT * FROM widget_configs WHERE user_id = $1', [userId]);
    
    // Agar user naya hai aur uski setting nahi hai, toh ek default setting bana do
    if (result.rows.length === 0) {
      const newConfig = await pool.query(
        'INSERT INTO widget_configs (user_id) VALUES ($1) RETURNING *',
        [userId]
      );
      return res.json(newConfig.rows[0]);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get Config Error:', error.message);
    res.status(500).json({ error: 'Server error fetching config' });
  }
};

// @desc    Update user's widget settings
// @route   PUT /api/widgets/config
const updateWidgetConfig = async (req, res) => {
  try {
    const userId = req.user.id;
    const { popup_text, theme_color, position, delay, show_avatar } = req.body;

    const result = await pool.query(
      `UPDATE widget_configs 
       SET popup_text = $1, theme_color = $2, position = $3, delay = $4, show_avatar = $5 
       WHERE user_id = $6 RETURNING *`,
      [popup_text, theme_color, position, delay, show_avatar, userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update Config Error:', error.message);
    res.status(500).json({ error: 'Server error updating config' });
  }
};

module.exports = { getWidgetConfig, updateWidgetConfig };