// backend/src/routes/widgetRoutes.js
const express = require('express');
const { getWidgetConfig, updateWidgetConfig } = require('../controllers/widgetController');
const { protect } = require('../middlewares/authMiddleware'); // Middleware import kiya

const router = express.Router();

// protect middleware yeh ensure karega ki bina login koi config access na kar sake
router.route('/config')
  .get(protect, getWidgetConfig)
  .put(protect, updateWidgetConfig);

module.exports = router;