# Quick Setup Guide

## Fixing Chatbot and PDF Issues

### Issue 1: Chatbot Not Working
**Problem:** Chatbot shows "technical difficulties" error

**Solution:** Start the backend server

```bash
# Terminal 1: Start Backend
cd server
npm install
npm run dev
```

The backend server must be running on http://localhost:3001 for the chatbot to work.

### Issue 2: PDF Download Opening Blank
**Problem:** PDF opens blank in browser

**Solution:** The PDF download has been fixed. Make sure:
1. Popups are allowed in your browser
2. Try clicking "Download & Print PDF" button
3. The print dialog should open with the report

---

## Complete Setup Steps

### 1. Start Backend Server (Required for Chatbot)

```bash
cd server
npm install
# The .env file already has the Groq API key configured
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
📡 API endpoints available at http://localhost:3001/api
```

### 2. Start Frontend (In a new terminal)

```bash
# Terminal 2: Start Frontend
npm install
npm run dev
```

### 3. Test the Features

1. **Chatbot:**
   - Click the chatbot button (bottom-right)
   - Type a message
   - Should get AI response

2. **PDF Download:**
   - Go to Dashboard tab
   - Scroll to "Download Financial Report"
   - Click "Download & Print PDF"
   - Print dialog should open with formatted report

---

## Troubleshooting

### Chatbot still not working?
1. Check if backend is running: http://localhost:3001/api/health
2. Check browser console for errors
3. Make sure `.env` file in `server/` folder has `GROQ_API_KEY`

### PDF still blank?
1. Allow popups in browser settings
2. Try "Download HTML Report" instead
3. Check browser console for errors

### Backend won't start?
- MongoDB is optional - server will start without it
- Check if port 3001 is already in use
- Make sure Node.js 18+ is installed

---

## Environment Variables

### Frontend (.env in root)
```
VITE_API_URL=http://localhost:3001/api
```

### Backend (server/.env)
```
MONGODB_URI=mongodb://localhost:27017/risk-radar
PORT=3001
GROQ_API_KEY=your_groq_api_key_here
```

**Note:** The actual API key is already configured in `server/.env` file locally. Don't commit it to GitHub.

---

## Quick Test

1. ✅ Backend running? → http://localhost:3001/api/health
2. ✅ Frontend running? → http://localhost:5173
3. ✅ Chatbot working? → Send a message
4. ✅ PDF working? → Click download button
