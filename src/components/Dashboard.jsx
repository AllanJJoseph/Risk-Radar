import { useState, useMemo } from 'react';
import RiskRadarChart from './RiskRadarChart';
import InputForm from './InputForm';
import InsightsPanel from './InsightsPanel';
import {
  computeRiskScores,
  getOverallGrade,
  generateInsights,
} from '../lib/riskEngine';

export default function Dashboard({ user, onLogout, onNavigateToProfile }) {
  const [inputs, setInputs] = useState(null);

  const scores = useMemo(() => {
    if (!inputs) {
      const defaultInput = {
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
      return computeRiskScores(defaultInput);
    }
    return computeRiskScores(inputs);
  }, [inputs]);

  const grade = useMemo(() => getOverallGrade(scores), [scores]);
  const insights = useMemo(
    () => generateInsights(inputs || {
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
    }, scores),
    [inputs, scores]
  );

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <div>
            <h1>Financial Risk Radar</h1>
            <p className="tagline">Middle-class India · Know your risks, protect your future</p>
          </div>
          <div className="user-menu">
            <button onClick={onNavigateToProfile} className="btn-profile">
              Profile
            </button>
            <span className="user-name">{user?.name || user?.email}</span>
            <button onClick={onLogout} className="btn-logout">Logout</button>
          </div>
        </div>
        <div className="grade-badge" style={{ borderColor: grade.color }}>
          <span className="grade-letter" style={{ color: grade.color }}>{grade.grade}</span>
          <span className="grade-label">{grade.label}</span>
        </div>
      </header>

      <main className="main">
        <section className="radar-section">
          <div className="radar-card">
            <RiskRadarChart scores={scores} />
          </div>
        </section>

        <section className="form-section">
          <InputForm onSubmit={setInputs} />
        </section>

        <section className="insights-section">
          <InsightsPanel insights={insights} />
        </section>
      </main>

      <footer className="footer">
        <p>For educational use. Not investment or tax advice. Consider consulting a SEBI-registered adviser.</p>
      </footer>
    </div>
  );
}
