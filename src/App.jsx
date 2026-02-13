import { useState, useEffect } from 'react';
import Login from './components/Login';
import EnhancedDashboard from './components/EnhancedDashboard';
import Profile from './components/Profile';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' or 'profile'

  useEffect(() => {
    // Check for existing session
    const authData = localStorage.getItem('riskRadarAuth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        if (parsed.loggedIn) {
          setUser(parsed);
        }
      } catch (e) {
        localStorage.removeItem('riskRadarAuth');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('riskRadarAuth');
    setUser(null);
    setCurrentPage('dashboard');
  };

  const handleNavigateToProfile = () => {
    setCurrentPage('profile');
  };

  const handleNavigateToDashboard = () => {
    setCurrentPage('dashboard');
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentPage === 'profile') {
    return (
      <Profile
        user={user}
        onLogout={handleLogout}
        onBack={handleNavigateToDashboard}
      />
    );
  }

  return (
    <EnhancedDashboard
      user={user}
      onLogout={handleLogout}
      onNavigateToProfile={handleNavigateToProfile}
    />
  );
}

export default App;
