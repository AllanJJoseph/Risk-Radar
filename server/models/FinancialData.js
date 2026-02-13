import mongoose from 'mongoose';

const financialDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Current financial snapshot
  monthlyIncome: Number,
  monthlyExpense: Number,
  emergencyFund: Number,
  monthlyEMI: Number,
  monthlySaving: Number,
  lifeCover: Number,
  healthCover: Number, // in lakhs
  retirementCorpus: Number,
  age: Number,
  equityPercent: Number,
  
  // Historical data for behavioral analysis
  history: [{
    date: Date,
    monthlyIncome: Number,
    monthlyExpense: Number,
    monthlySaving: Number,
    monthlyEMI: Number,
    emergencyFund: Number,
    savingsRate: Number, // calculated
  }],
  
  // Journey tracking
  milestones: [{
    type: String, // 'emergency_fund_6m', 'savings_rate_20', etc.
    unlockedAt: Date,
    description: String,
  }],
  
  badges: [{
    name: String,
    earnedAt: Date,
    description: String,
  }],
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

financialDataSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

financialDataSchema.index({ userId: 1 });

export default mongoose.model('FinancialData', financialDataSchema);
