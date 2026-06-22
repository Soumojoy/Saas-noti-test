// backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // Check karo ki header mein token hai ya nahi
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 'Bearer token123' se sirf 'token123' nikalna
      token = req.headers.authorization.split(' ')[1];

      // Token verify karo (kya yeh humne hi banaya tha?)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // User ka ID request object mein daal do taaki aage controllers use kar sakein
      req.user = { id: decoded.id };
      
      next(); // Sab theek hai, ab request ko aage badhne do
    } catch (error) {
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }
};

module.exports = { protect };