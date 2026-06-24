// backend/src/controllers/authController.js

// --- IMPORTS ---
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// --- METHOD 1: REGISTER ---
const register = async (req, res) => {
  // req.body se frontend ka data nikalna
  const { name, email, password } = req.body;

  try {
    // 1. Check karo kya user pehle se exist karta hai?
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // 2. Password ko hash (encrypt) karo
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Naye user ko Database (PostgreSQL) mein save karo
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    // 4. Token (JWT) generate karo
    const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // 5. Frontend ko response bhejo
    res.status(201).json({ user: newUser.rows[0], token });

  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// --- METHOD 2: LOGIN ---
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Database mein user ko dhundo
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid Email or Password' }); // Always keep error vague for security
    }

    const user = result.rows[0];

    // 2. Password match karo (bcrypt automatically hash compare kar lega)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid Email or Password' });
    }

    // 3. Agar sahi hai toh Token do
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token
    });

  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// Dono methods ko export karo taaki Routes inhe use kar sakein
module.exports = { register, login };