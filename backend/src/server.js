// backend/src/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();


// Humare banaye hue routes import kar rahe hain
const authRoutes = require('./routes/authRoutes');

const widgetRoutes = require('./routes/widgetRoutes');

const app = express();

// Middlewares
app.use(cors()); // React app ko API call karne ki permission deta hai
app.use(express.json()); // Frontend se aane wale JSON data ko parse karta hai

// Routes mount karna
app.use('/api/auth', authRoutes);
//widget
app.use('/api/widgets', widgetRoutes);

// Health check route (Testing ke liye ki server zinda hai ya nahi)
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Backend is running perfectly! 🚀' });
});

// Server start karna
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});