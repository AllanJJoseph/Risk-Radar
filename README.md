# Risk-Radar · Financial Risk Radar for Middle-class India

A comprehensive AI-powered financial risk assessment tool with predictive analytics, behavioral insights, and MongoDB integration.

## Features

### 🤖 AI Chatbot
Ask questions about your finances and get personalized AI-powered advice using Groq AI.

### 📄 Report Download & Print
Download comprehensive PDF/HTML reports of your financial analysis with all details for printing.

### 🔮 1. Future Risk Forecast (Predictive Mode)
Simulates financial health 6-12 months ahead based on spending trends, savings growth, and EMI burden.

### 🧠 2. Behavioral Spending Risk Detector
Detects patterns like lifestyle inflation, EMI creep, and declining savings discipline.

### 🇮🇳 3. Indian Life Event Stress Simulator
Simulates common middle-class shocks: medical emergencies, job loss, wedding expenses, inflation spikes.

### 🎯 4. Financial Stability Score + Persona
Assigns users to categories: Safe Builder, EMI Struggler, Growth Planner, Risk Exposed.

### 🚨 5. Early Warning Alerts Engine
Real-time warnings for debt threshold breaches, unsafe emergency funds, poor retirement trajectory.

### 🪙 6. Inflation Reality Check
Shows purchasing power erosion: "Your ₹10L today ≈ ₹5L in 15 years."

### 🧩 7. Financial Health Journey Tracker
Gamified milestones and badges for financial improvement.

### 📊 8. Scenario Comparison Mode
Compare current vs improved financial plans with radar overlays.

### 🧭 9. Action Impact Estimator
See how specific actions (increase savings, reduce EMI) improve risk scores.

### 🧑‍🏫 10. Smart Insight Explanations
AI-style explanations of why scores are low and how to fix them.

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Charts**: Chart.js

## Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

**Important:** The backend server is required for the AI chatbot to work.

```bash
cd server
npm install
cp .env.example .env
# Edit .env with:
# - MONGODB_URI (optional - chatbot works without it)
# - GROQ_API_KEY=your_groq_api_key (required for chatbot)
npm run dev
```

The server will start on http://localhost:3001

**Note:** MongoDB is optional. The chatbot will work without MongoDB, but user data won't be saved.

### Frontend Setup

```bash
npm install
cp .env.example .env
# Edit .env with:
# - VITE_API_URL=http://localhost:3001/api (backend API URL)
# - VITE_GROQ_API_KEY=your_groq_api_key (get from https://console.groq.com)
npm run dev
```

**Note:** To use the AI chatbot feature, you need a Groq API key:
1. Sign up at https://console.groq.com
2. Create an API key
3. Add it to your `.env` file as `VITE_GROQ_API_KEY`

### MongoDB Setup

**Option 1: Local MongoDB**
```bash
# Install MongoDB locally, then:
MONGODB_URI=mongodb://localhost:27017/risk-radar
```

**Option 2: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster and database
3. Get connection string
4. Set in `.env`: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/risk-radar`

## Run Locally

1. Start MongoDB (if local)
2. Start backend: `cd server && npm run dev`
3. Start frontend: `npm run dev`
4. Open http://localhost:5173

## Deployment

### Backend
Deploy to Heroku, Railway, or similar. Set `MONGODB_URI` environment variable.

### Frontend
Deploy to Vercel, Netlify, or GitHub Pages. Set `VITE_API_URL` to your backend URL.

## Project Structure

```
financial-risk-radar/
├── server/                 # Backend API
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── server.js          # Express server
├── src/
│   ├── components/        # React components
│   │   └── features/      # Feature components
│   ├── lib/               # Utilities
│   │   ├── riskEngine.js  # Core risk calculations
│   │   ├── enhancedRiskEngine.js  # Advanced features
│   │   └── api.js         # API client
│   └── App.jsx            # Main app
└── README.md
```

## API Endpoints

- `POST /api/users` - Create/update user
- `GET /api/users/:email` - Get user by email
- `GET /api/financial-data/:userId` - Get financial data
- `POST /api/financial-data/:userId/snapshot` - Save financial snapshot
- `POST /api/financial-data/:userId/milestone` - Add milestone
- `POST /api/financial-data/:userId/badge` - Add badge

## License

For educational use. Not investment or tax advice.
