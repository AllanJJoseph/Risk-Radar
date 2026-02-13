import express from 'express';
import FinancialData from '../models/FinancialData.js';

const router = express.Router();

// Get comprehensive risk analysis
router.post('/analyze', async (req, res) => {
  try {
    const { userId, financialData } = req.body;
    
    // Import risk engine functions (would need to be converted to CommonJS or use dynamic import)
    // For now, return structure - actual calculations done in frontend
    
    res.json({
      success: true,
      message: 'Risk analysis endpoint - calculations done in frontend',
      userId,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Chatbot proxy endpoint (to avoid CORS issues)
router.post('/chat', async (req, res) => {
  try {
    const { messages, userData, financialData, scores, persona } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        success: false, 
        error: 'Groq API key not configured on server' 
      });
    }

    const systemMessage = {
      role: 'system',
      content: `You are a helpful AI financial advisor specializing in middle-class Indian financial planning. You have access to the user's financial data:

User Profile:
- Name: ${userData?.name || 'User'}
- Age: ${financialData?.age || 'Not provided'}
- Monthly Income: ₹${(financialData?.monthlyIncome || 0).toLocaleString('en-IN')}
- Monthly Expense: ₹${(financialData?.monthlyExpense || 0).toLocaleString('en-IN')}
- Monthly Savings: ₹${(financialData?.monthlySaving || 0).toLocaleString('en-IN')}
- Emergency Fund: ₹${(financialData?.emergencyFund || 0).toLocaleString('en-IN')}
- Monthly EMI: ₹${(financialData?.monthlyEMI || 0).toLocaleString('en-IN')}
- Life Cover: ₹${(financialData?.lifeCover || 0).toLocaleString('en-IN')}
- Health Cover: ₹${(financialData?.healthCover || 0)} lakhs
- Retirement Corpus: ₹${(financialData?.retirementCorpus || 0).toLocaleString('en-IN')}
- Equity Allocation: ${financialData?.equityPercent || 0}%

Financial Risk Scores:
- Emergency Fund: ${scores?.['Emergency Fund'] || 0}/100
- Debt Burden: ${scores?.['Debt Burden'] || 0}/100
- Savings Rate: ${scores?.['Savings Rate'] || 0}/100
- Insurance Cover: ${scores?.['Insurance Cover'] || 0}/100
- Retirement Readiness: ${scores?.['Retirement Readiness'] || 0}/100
- Inflation Protection: ${scores?.['Inflation Protection'] || 0}/100

Financial Persona: ${persona?.persona || 'Not available'}

Provide helpful, personalized financial advice based on this data. Be concise, practical, and focus on actionable steps. Use Indian context (INR, Indian financial products like NPS, EPF, PPF, SIPs, etc.). Always be encouraging and supportive.`,
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    res.json({
      success: true,
      message: data.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.',
    });
  } catch (error) {
    console.error('Chatbot proxy error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to get AI response' 
    });
  }
});

export default router;
