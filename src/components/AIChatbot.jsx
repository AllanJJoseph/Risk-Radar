import { useState, useRef, useEffect } from 'react';

export default function AIChatbot({ user, financialData, scores, persona }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI financial advisor. I can help you understand your financial risk scores, provide personalized advice, answer questions about your financial health, and guide you on improving your financial situation. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        throw new Error('Groq API key not configured');
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are a helpful AI financial advisor specializing in middle-class Indian financial planning. You have access to the user's financial data:

User Profile:
- Name: ${user?.name || 'User'}
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
            },
            ...messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiMessage = {
        role: 'assistant',
        content: data.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.',
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chatbot"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {!isOpen && <span className="chatbot-badge">AI</span>}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <div className="chatbot-avatar">🤖</div>
              <div>
                <div className="chatbot-title">AI Financial Advisor</div>
                <div className="chatbot-subtitle">Powered by Groq AI</div>
              </div>
            </div>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chatbot-message chatbot-message-${msg.role}`}>
                <div className="chatbot-message-content">{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="chatbot-message chatbot-message-assistant">
                <div className="chatbot-message-content">
                  <div className="chatbot-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chatbot-input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your finances..."
              className="chatbot-input"
              disabled={loading}
            />
            <button
              type="submit"
              className="chatbot-send"
              disabled={loading || !input.trim()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
