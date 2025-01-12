const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../User_model/User');

dotenv.config();

const authMiddleware = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user object to the request
      // flag 1 incorrect user error
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      // flag 2 token error
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  // flag 3 no token error
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = authMiddleware;
