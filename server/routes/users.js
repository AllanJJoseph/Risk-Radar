import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Create or update user
router.post('/', async (req, res) => {
  try {
    const { email, name, ...profileData } = req.body;
    
    let user = await User.findOne({ email });
    
    if (user) {
      // Update existing user
      Object.assign(user, profileData);
      await user.save();
    } else {
      // Create new user
      user = new User({ email, name, ...profileData });
      await user.save();
    }
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get user by email
router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update user profile
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
