
// Different variables fetching data/values
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../User_model/User');
const generateToken = require('../utils/generateToken');

exports.createUser = async (req, res) => {
  try {
    const { name, lastName, email, mobile, password } = req.body;

    // Check if user already exists using email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // new User (empty fields)
    // schema: name, lastName, email, mobile, userImage, password
    const user = await User.create({
      name,
      lastName,
      email,
      mobile,
      userImage: '',
      password,
    });

    // Rename the uploaded file to userId.extension
    // imagePath = uploads/userId.extension (e.g. uploads/60f7b1b7b3b3b4f7c8b3b3b4.jpg)

    if (req.file) {
      const fileExtension = path.extname(req.file.originalname);
      const newFileName = `${user._id}${fileExtension}`;
      const newPath = path.join('uploads', newFileName);

      fs.renameSync(req.file.path, newPath); // Rename the file
      user.userImage = newPath; // Update the userImage field
      await user.save();
    }

    return res.status(201).json({
      message: 'User created successfully',
      data: user,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Error creating user: (line 49)', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET TOKEN FUNCTIONALITY

exports.getToken = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found (CONTROLLER FLAG1)' });
    }

    // used bcrypt to compare the password
    // Compare plaintext password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password (CONTROLLER FLAG2)' });
    }

    const token = generateToken(user._id);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error fetching token: (controller flag3)', error);
  }
};

// ------------------------------------------------
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// implemented pagination twice using limit and skip index
// backend diff pagination and frontend different pagination (limit are 10 and 5 respectively)

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page)||1;
    const limit = parseInt(req.query.limit)||10;

    const skipIndex = (page-1)*limit;

    const users = await User.find({})
      .skip(skipIndex)
      .limit(limit)
      .select('-password'); // Excluding password field security layer

    const totalUsers = await User.countDocuments();

    return res.status(200).json({
      total: totalUsers,
      page,
      limit,
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users: (line 117)', error);
    return res.status(500).json({ message: 'Server error (line 118)' });
  }
};

// updating user
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, lastName, email, mobile } = req.body;

    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;

    // Handle file upload and rename
    if (req.file) {
      const fileExtension = path.extname(req.file.originalname);
      const newFileName = `${user._id}${fileExtension}`;
      const newPath = path.join('uploads', newFileName);

      // Delete old image if it exists
      if (user.userImage && fs.existsSync(user.userImage)) {
        fs.unlinkSync(user.userImage);
      }

      fs.renameSync(req.file.path, newPath);
      user.userImage = newPath;
    }

    await user.save();

    return res.status(200).json({
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Error updating user:(flag control)', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


// user deletion

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find and delete user
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found or already deleted' });
    }

    // Delete user's image from server
    if (user.userImage && fs.existsSync(user.userImage)) {
      fs.unlinkSync(user.userImage);
    }

    return res.status(200).json({message: 'User deleted successfully',});
  } 
  
  catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Server error (backend flag)' });
  }
};
