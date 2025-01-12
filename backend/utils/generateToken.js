const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
// jwt token generation with user id and secret key
// expures in 5 days
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '5d',
  });
};

module.exports = generateToken;
