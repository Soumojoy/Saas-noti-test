// backend/src/controllers/widgetController.js
const crypto = require('crypto');
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
      const widgetKey = crypto.randomUUID();
      const newConfig = await pool.query(
        'INSERT INTO widget_configs (user_id, widget_key) VALUES ($1, $2) RETURNING *',
        [userId, widgetKey]
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

// @desc    Get public widget config & mock events by widget key
// @route   GET /api/widgets/embed-config
const getEmbedConfig = async (req, res) => {
  try {
    const { key } = req.query;

    if (!key) {
      return res.status(400).json({ error: 'Widget key is required' });
    }

    const result = await pool.query('SELECT * FROM widget_configs WHERE widget_key = $1', [key]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid widget key' });
    }

    // High quality mock events for social proof
    const mockEvents = [
      { name: 'Rajesh', city: 'Mumbai', product: 'Premium Plan', time: '2 minutes ago' },
      { name: 'Priya', city: 'Delhi', product: 'Basic Plan', time: '7 minutes ago' },
      { name: 'Amit', city: 'Bangalore', product: 'Premium Plan', time: '15 minutes ago' },
      { name: 'Sneha', city: 'Pune', product: 'Enterprise Suite', time: '28 minutes ago' },
      { name: 'Vikram', city: 'Hyderabad', product: 'Basic Plan', time: '1 hour ago' }
    ];

    res.json({
      config: result.rows[0],
      events: mockEvents
    });
  } catch (error) {
    console.error('Embed Config Error:', error.message);
    res.status(500).json({ error: 'Server error fetching embed config' });
  }
};

module.exports = { getWidgetConfig, updateWidgetConfig, getEmbedConfig };