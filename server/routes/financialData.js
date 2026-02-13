import express from 'express';
import FinancialData from '../models/FinancialData.js';

const router = express.Router();

// Get or create financial data for user
router.get('/:userId', async (req, res) => {
  try {
    let data = await FinancialData.findOne({ userId: req.params.userId });
    if (!data) {
      data = new FinancialData({ userId: req.params.userId });
      await data.save();
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save financial snapshot
router.post('/:userId/snapshot', async (req, res) => {
  try {
    let data = await FinancialData.findOne({ userId: req.params.userId });
    
    if (!data) {
      data = new FinancialData({ userId: req.params.userId });
    }
    
    const snapshot = {
      date: new Date(),
      monthlyIncome: req.body.monthlyIncome,
      monthlyExpense: req.body.monthlyExpense,
      monthlySaving: req.body.monthlySaving,
      monthlyEMI: req.body.monthlyEMI,
      emergencyFund: req.body.emergencyFund,
      savingsRate: req.body.monthlyIncome > 0 
        ? (req.body.monthlySaving / req.body.monthlyIncome) * 100 
        : 0,
    };
    
    // Update current data
    Object.assign(data, req.body);
    
    // Add to history (keep last 12 months)
    data.history.push(snapshot);
    if (data.history.length > 12) {
      data.history.shift();
    }
    
    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Add milestone
router.post('/:userId/milestone', async (req, res) => {
  try {
    const data = await FinancialData.findOne({ userId: req.params.userId });
    if (!data) {
      return res.status(404).json({ success: false, error: 'Financial data not found' });
    }
    
    data.milestones.push({
      type: req.body.type,
      unlockedAt: new Date(),
      description: req.body.description,
    });
    
    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Add badge
router.post('/:userId/badge', async (req, res) => {
  try {
    const data = await FinancialData.findOne({ userId: req.params.userId });
    if (!data) {
      return res.status(404).json({ success: false, error: 'Financial data not found' });
    }
    
    data.badges.push({
      name: req.body.name,
      earnedAt: new Date(),
      description: req.body.description,
    });
    
    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
