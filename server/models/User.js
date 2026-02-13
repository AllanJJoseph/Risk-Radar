import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: false, // Optional for demo
  },
  name: {
    type: String,
    required: true,
  },
  phone: String,
  dateOfBirth: Date,
  city: String,
  state: String,
  pincode: String,
  occupation: String,
  retirementAge: {
    type: Number,
    default: 58,
  },
  targetRetirementCorpus: Number,
  financialGoals: String,
  panNumber: String,
  aadharNumber: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('User', userSchema);
