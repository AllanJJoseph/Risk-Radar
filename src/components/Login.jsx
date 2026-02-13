import { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simple validation - for demo, accept any non-empty email/password
    // In production, replace with real authentication API
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    // Mock authentication - accept any credentials for demo
    // TODO: Replace with real API call
    // const response = await fetch('/api/login', { ... });
    
    // Store auth token/user info (mock)
    const userData = {
      email: email.trim(),
      name: email.split('@')[0],
      loggedIn: true,
    };
    
    localStorage.setItem('riskRadarAuth', JSON.stringify(userData));
    onLogin(userData);
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Financial Risk Radar</h1>
          <p className="login-tagline">Sign in to access your financial dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              autoFocus
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="login-demo">
            <small>Demo: Enter any email and password to continue</small>
          </p>
        </form>
      </div>
    </div>
  );
}
