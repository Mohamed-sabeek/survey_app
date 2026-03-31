const Admin = require('../models/Admin');
const Survey = require('../models/Survey');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new admin
// @route   POST /api/admin/register
// @access  Public
const registerAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Please add all fields' });
    }

    // Check if admin exists
    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = await Admin.create({
      email,
      password: hashedPassword,
    });

    if (admin) {
      res.status(201).json({
        _id: admin.id,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(400).json({ error: 'Invalid admin data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Authenticate admin
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for admin email
    const admin = await Admin.findOne({ email });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      res.json({
        _id: admin.id,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get all survey responses
// @route   GET /api/admin/responses
// @access  Private
const getAllResponses = async (req, res) => {
  try {
    const responses = await Survey.find().sort({ createdAt: -1 });
    res.status(200).json(responses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching responses' });
  }
};

// @desc    Update a survey response
// @route   PUT /api/admin/responses/:id
// @access  Private
const updateResponse = async (req, res) => {
  try {
    const response = await Survey.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ error: 'Survey response not found' });
    }

    const updatedResponse = await Survey.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating response' });
  }
};

// @desc    Delete a survey response
// @route   DELETE /api/admin/responses/:id
// @access  Private
const deleteResponse = async (req, res) => {
  try {
    const response = await Survey.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ error: 'Survey response not found' });
    }

    await response.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Response deleted perfectly' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting response' });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAllResponses,
  updateResponse,
  deleteResponse,
};
