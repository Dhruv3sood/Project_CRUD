const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI); 
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Throw db connection flag (error in db.js)', error);
    process.exit(1);
  }
};

module.exports = connectDB;
