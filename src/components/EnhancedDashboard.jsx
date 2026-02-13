import { useState, useMemo, useEffect } from 'react';
import RiskRadarChart from './RiskRadarChart';
import InputForm from './InputForm';
import InsightsPanel from './InsightsPanel';
import {
  computeRiskScores,
  getOverallGrade,
  generateInsights,
} from '../lib/riskEngine';
import {
  forecastFutureRisk,
  detectBehavioralRisks,
  simulateLifeEvent,
  getFinancialPersona,
  generateEarlyWarnings,
  calculateInflationImpact,
  checkMilestones,
  getBadges,
  compareScenarios,
  estimateActionImpact,
  generateSmartInsights,
} from '../lib/enhancedRiskEngine';
import { api } from '../lib/api';
import FutureForecast from './features/FutureForecast';
import BehavioralDetector from './features/BehavioralDetector';
import LifeEventSimulator from './features/LifeEventSimulator';
import PersonaCard from './features/PersonaCard';
import EarlyWarnings from './features/EarlyWarnings';
import InflationReality from './features/InflationReality';
import JourneyTracker from './features/JourneyTracker';
import ScenarioComparison from './features/ScenarioComparison';
import ActionImpact from './features/ActionImpact';
import SmartInsights from './features/SmartInsights';

export default function EnhancedDashboard({ user, onLogout, onNavigateToProfile }) {
  const [inputs, setInputs] = useState(null);
  const [financialHistory, setFinancialHistory] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [badges, setBadges] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Load user and financial data from MongoDB
  useEffect(() => {
    async function loadData() {
      try {
        // Get or create user
        const userResponse = await api.createOrUpdateUser({
          email: user.email,
          name: user.name,
        });
        
        if (userResponse.success) {
          const userId = userResponse.user._id || userResponse.user.id;
          setUserId(userId);
          
          // Load financial data
          const dataResponse = await api.getFinancialData(userId);
          if (dataResponse.success && dataResponse.data) {
            const fd = dataResponse.data;
            if (fd.monthlyIncome) {
              setInputs({
                monthlyIncome: fd.monthlyIncome,
                monthlyExpense: fd.monthlyExpense,
                emergencyFund: fd.emergencyFund,
                monthlyEMI: fd.monthlyEMI,
                monthlySaving: fd.monthlySaving,
                lifeCover: fd.lifeCover,
                healthCover: fd.healthCover,
                retirementCorpus: fd.retirementCorpus,
                age: fd.age,
                equityPercent: fd.equityPercent,
              });
            }
            setFinancialHistory(fd.history || []);
            setMilestones(fd.milestones || []);
            setBadges(fd.badges || []);
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        // Fallback to default data
        setInputs({
          monthlyIncome: 75000,
          monthlyExpense: 45000,
          emergencyFund: 150000,
          monthlyEMI: 18000,
          monthlySaving: 12000,
          lifeCover: 9000000,
          healthCover: 5,
          retirementCorpus: 2500000,
          age: 35,
          equityPercent: 65,
        });
      } finally {
        setLoading(false);
      }
    }
    
    if (user) {
      loadData();
    }
  }, [user]);

  const currentData = inputs || {
    monthlyIncome: 75000,
    monthlyExpense: 45000,
    emergencyFund: 150000,
    monthlyEMI: 18000,
    monthlySaving: 12000,
    lifeCover: 9000000,
    healthCover: 5,
    retirementCorpus: 2500000,
    age: 35,
    equityPercent: 65,
  };

  const scores = useMemo(() => computeRiskScores(currentData), [currentData]);
  const grade = useMemo(() => getOverallGrade(scores), [scores]);
  const insights = useMemo(() => generateInsights(currentData, scores), [currentData, scores]);

  // Enhanced features
  const futureForecast = useMemo(() => forecastFutureRisk(currentData, 6), [currentData]);
  const behavioralRisks = useMemo(() => detectBehavioralRisks(financialHistory), [financialHistory]);
  const persona = useMemo(() => getFinancialPersona(scores, currentData), [scores, currentData]);
  const warnings = useMemo(() => generateEarlyWarnings(currentData, scores), [currentData, scores]);
  const inflationImpact = useMemo(() => calculateInflationImpact(currentData.emergencyFund || 100000, 15), [currentData]);
  const newMilestones = useMemo(() => checkMilestones(currentData, milestones), [currentData, milestones]);
  const newBadges = useMemo(() => getBadges(scores), [scores]);
  const smartInsights = useMemo(() => generateSmartInsights(currentData, scores), [currentData, scores]);

  // Save financial snapshot when inputs change
  const handleInputSubmit = async (newInputs) => {
    setInputs(newInputs);
    
    if (userId) {
      try {
        await api.saveFinancialSnapshot(userId, newInputs);
        
        // Check for new milestones
        const newMs = checkMilestones(newInputs, milestones);
        if (newMs.length > 0) {
          for (const m of newMs) {
            await api.addMilestone(userId, m);
          }
          setMilestones([...milestones, ...newMs]);
        }
        
        // Check for new badges
        const newBs = getBadges(computeRiskScores(newInputs));
        const existingBadgeNames = badges.map(b => b.name);
        const badgesToAdd = newBs.filter(b => !existingBadgeNames.includes(b.name));
        if (badgesToAdd.length > 0) {
          for (const b of badgesToAdd) {
            await api.addBadge(userId, b);
          }
          setBadges([...badges, ...badgesToAdd]);
        }
      } catch (error) {
        console.error('Failed to save snapshot:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <div>
            <h1>Financial Risk Radar</h1>
            <p className="tagline">Middle-class India · Know your risks, protect your future</p>
          </div>
          <div className="user-menu">
            <button onClick={onNavigateToProfile} className="btn-profile">Profile</button>
            <span className="user-name">{user?.name || user?.email}</span>
            <button onClick={onLogout} className="btn-logout">Logout</button>
          </div>
        </div>
        <div className="grade-badge" style={{ borderColor: grade.color }}>
          <span className="grade-letter" style={{ color: grade.color }}>{grade.grade}</span>
          <span className="grade-label">{grade.label}</span>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="dashboard-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'forecast' ? 'active' : ''}
          onClick={() => setActiveTab('forecast')}
        >
          Future Forecast
        </button>
        <button 
          className={activeTab === 'scenarios' ? 'active' : ''}
          onClick={() => setActiveTab('scenarios')}
        >
          Scenarios
        </button>
        <button 
          className={activeTab === 'journey' ? 'active' : ''}
          onClick={() => setActiveTab('journey')}
        >
          Journey
        </button>
      </nav>

      <main className="main">
        {activeTab === 'dashboard' && (
          <>
            <section className="radar-section">
              <div className="radar-card">
                <RiskRadarChart scores={scores} />
              </div>
            </section>

            <section className="form-section">
              <InputForm onSubmit={handleInputSubmit} />
            </section>

            <section className="insights-section">
              <PersonaCard persona={persona} />
              <EarlyWarnings warnings={warnings} />
              <SmartInsights insights={smartInsights} />
              <InflationReality impact={inflationImpact} />
              {behavioralRisks.detected && (
                <BehavioralDetector risks={behavioralRisks} />
              )}
            </section>
          </>
        )}

        {activeTab === 'forecast' && (
          <FutureForecast forecast={futureForecast} />
        )}

        {activeTab === 'scenarios' && (
          <>
            <LifeEventSimulator currentData={currentData} />
            <ScenarioComparison currentData={currentData} />
            <ActionImpact currentData={currentData} />
          </>
        )}

        {activeTab === 'journey' && (
          <JourneyTracker 
            milestones={[...milestones, ...newMilestones]} 
            badges={[...badges, ...newBadges]}
          />
        )}
      </main>

      <footer className="footer">
        <p>For educational use. Not investment or tax advice. Consider consulting a SEBI-registered adviser.</p>
      </footer>
    </div>
  );
}
