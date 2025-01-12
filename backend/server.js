const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./database_config/db');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const path = require('path');

dotenv.config(); // Load environment variables
connectDB(); // Connecting to the database

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files as file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/users', userRoutes);

// connection to frontend build folder
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
} else {
  // Development environment message
  app.get('/', (req, res) => {
    res.send('API is running...(flag check) server.js line 33');
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
