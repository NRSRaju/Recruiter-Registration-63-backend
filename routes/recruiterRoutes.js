const express = require('express');
const Recruiter = require('../models/Recruiter');
const bcrypt = require('bcryptjs');
const router = express.Router();

// @route   POST /api/recruiters/register
// @desc    Register a new recruiter
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, address, gstNumber } = req.body;

  try {
    // Check if recruiter already exists
    const existingRecruiter = await Recruiter.findOne({ email });
    if (existingRecruiter) {
      return res.status(400).json({ message: 'Recruiter already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new recruiter
    const newRecruiter = new Recruiter({
      name,
      email,
      password: hashedPassword,
      address,
      gstNumber,
    });

    await newRecruiter.save();
    res.status(201).json({ message: 'Recruiter registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
