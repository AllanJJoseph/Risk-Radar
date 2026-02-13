import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import financialDataRoutes from './routes/financialData.js';
import riskRoutes from './routes/risk.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/financial-data', financialDataRoutes);
app.use('/api/risk', riskRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Risk Radar API is running' });
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/risk-radar';

// Start server even if MongoDB is not available (for demo purposes)
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  
  // Try to connect to MongoDB (optional)
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB');
    })
    .catch((error) => {
      console.warn('⚠️  MongoDB not connected:', error.message);
      console.log('💡 Tip: MongoDB is optional. Chatbot will work without it.');
      console.log('💡 To enable MongoDB: Install MongoDB or set MONGODB_URI in .env');
    });
});

export default app;
