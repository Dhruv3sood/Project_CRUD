const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const {
  createUser,
  getToken,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const authMiddleware = require('../authenticate_middleware/authMiddleware');

// Multer setup for file upload
// local storage named uploads for images and path stored in database
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Temporary name, will rename in controller
  },
});

const upload = multer({ storage });

// Routes
// api request routes and which rest operations are path for each request
// authMiddleware is used to check for token in request header

router.post('/', upload.single('userImage'), createUser);
router.post('/getToken', getToken);
router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
