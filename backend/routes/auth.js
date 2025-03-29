const express = require('express');
const User = require('../models/User');
const admin = require('firebase-admin');
const router = express.Router();

// Register or update user in database
router.post('/register', async (req, res) => {
    try {
      const { uid, name, email } = req.body;
      console.log("Received registration data:", { uid, name, email });
  
      // Find or create user
      const user = await User.findOneAndUpdate(
        { firebaseUid: uid },
        { name, email },
        { upsert: true, new: true }
      );
  
      console.log("User registered/updated:", user);
      res.status(200).json(user);
    } catch (err) {
      console.error("Error registering user:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

// Get current user details
router.post('/me', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: 'Email is required' });
  
      // 🔹 Find user by email
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      res.json(user); // Return user data
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


module.exports = router;