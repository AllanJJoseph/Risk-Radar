import { useState, useEffect } from 'react';

export default function Profile({ user, onLogout, onBack }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    city: '',
    state: '',
    pincode: '',
    occupation: '',
    retirementAge: 58,
    targetRetirementCorpus: '',
    financialGoals: '',
    panNumber: '',
    aadharNumber: '',
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load saved profile data from localStorage
    const savedProfile = localStorage.getItem('riskRadarProfile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Error loading profile:', e);
      }
    } else {
      // Initialize with user data from login
      setFormData(prev => ({
        ...prev,
        name: user?.name || '',
        email: user?.email || '',
      }));
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Save to localStorage (in production, save to backend)
    localStorage.setItem('riskRadarProfile', JSON.stringify(formData));
    
    // Update user data
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('riskRadarAuth', JSON.stringify(updatedUser));

    setSaved(true);
    setLoading(false);
    
    // Clear saved message after 3 seconds
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <div>
            <h1>My Profile</h1>
            <p className="tagline">Manage your personal and financial information</p>
          </div>
          <div className="user-menu">
            <button onClick={onBack} className="btn-secondary">Back to Dashboard</button>
            <button onClick={onLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </header>

      <main className="main profile-main">
        <form onSubmit={handleSubmit} className="profile-form">
          {saved && (
            <div className="profile-saved">
              ✓ Profile saved successfully!
            </div>
          )}

          <section className="profile-section">
            <h2>Personal Information</h2>
            <div className="profile-grid">
              <div className="profile-field">
                <label htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="profile-field">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="profile-field">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  maxLength="15"
                />
              </div>

              <div className="profile-field">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                />
              </div>

              <div className="profile-field">
                <label htmlFor="occupation">Occupation</label>
                <input
                  id="occupation"
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => handleChange('occupation', e.target.value)}
                  placeholder="e.g., Software Engineer, Teacher"
                />
              </div>
            </div>
          </section>

          <section className="profile-section">
            <h2>Address</h2>
            <div className="profile-grid">
              <div className="profile-field">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Mumbai"
                />
              </div>

              <div className="profile-field">
                <label htmlFor="state">State</label>
                <input
                  id="state"
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="Maharashtra"
                />
              </div>

              <div className="profile-field">
                <label htmlFor="pincode">PIN Code</label>
                <input
                  id="pincode"
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value.replace(/\D/g, ''))}
                  placeholder="400001"
                  maxLength="6"
                />
              </div>
            </div>
          </section>

          <section className="profile-section">
            <h2>Financial Goals</h2>
            <div className="profile-grid">
              <div className="profile-field">
                <label htmlFor="retirementAge">Target Retirement Age</label>
                <input
                  id="retirementAge"
                  type="number"
                  min="50"
                  max="70"
                  value={formData.retirementAge}
                  onChange={(e) => handleChange('retirementAge', e.target.value)}
                  placeholder="58"
                />
              </div>

              <div className="profile-field">
                <label htmlFor="targetRetirementCorpus">Target Retirement Corpus (₹)</label>
                <input
                  id="targetRetirementCorpus"
                  type="number"
                  min="0"
                  step="100000"
                  value={formData.targetRetirementCorpus}
                  onChange={(e) => handleChange('targetRetirementCorpus', e.target.value)}
                  placeholder="50000000"
                />
              </div>

              <div className="profile-field profile-field-full">
                <label htmlFor="financialGoals">Financial Goals</label>
                <textarea
                  id="financialGoals"
                  value={formData.financialGoals}
                  onChange={(e) => handleChange('financialGoals', e.target.value)}
                  placeholder="e.g., Buy a house in 5 years, children's education fund, emergency fund of ₹10L"
                  rows="3"
                />
              </div>
            </div>
          </section>

          <section className="profile-section">
            <h2>Identity Documents (Optional)</h2>
            <div className="profile-grid">
              <div className="profile-field">
                <label htmlFor="panNumber">PAN Number</label>
                <input
                  id="panNumber"
                  type="text"
                  value={formData.panNumber}
                  onChange={(e) => handleChange('panNumber', e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  maxLength="10"
                  pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                />
              </div>

              <div className="profile-field">
                <label htmlFor="aadharNumber">Aadhaar Number</label>
                <input
                  id="aadharNumber"
                  type="text"
                  value={formData.aadharNumber}
                  onChange={(e) => handleChange('aadharNumber', e.target.value.replace(/\D/g, ''))}
                  placeholder="1234 5678 9012"
                  maxLength="12"
                />
              </div>
            </div>
            <p className="profile-note">
              <small>Identity documents are optional and stored locally. For production, use secure backend storage.</small>
            </p>
          </section>

          <div className="profile-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
            <button type="button" onClick={onBack} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </main>

      <footer className="footer">
        <p>For educational use. Not investment or tax advice. Consider consulting a SEBI-registered adviser.</p>
      </footer>
    </div>
  );
}
