import { useState } from 'react';
import { compareScenarios } from '../../lib/enhancedRiskEngine';
import RiskRadarChart from '../RiskRadarChart';

export default function ScenarioComparison({ currentData }) {
  const [improvedData, setImprovedData] = useState({
    ...currentData,
    monthlySaving: (currentData.monthlySaving || 0) + 5000,
    emergencyFund: (currentData.emergencyFund || 0) + 100000,
  });
  const [comparison, setComparison] = useState(null);

  const handleCompare = () => {
    const result = compareScenarios(currentData, improvedData);
    setComparison(result);
  };

  return (
    <div className="feature-card scenario-comparison">
      <h2>📊 Scenario Comparison Mode</h2>
      <p className="feature-description">Compare your current plan with an improved scenario</p>
      
      <div className="scenario-inputs">
        <div className="scenario-input">
          <label>Improved Monthly Savings (₹)</label>
          <input
            type="number"
            value={improvedData.monthlySaving}
            onChange={(e) => setImprovedData({ ...improvedData, monthlySaving: Number(e.target.value) })}
          />
        </div>
        <div className="scenario-input">
          <label>Improved Emergency Fund (₹)</label>
          <input
            type="number"
            value={improvedData.emergencyFund}
            onChange={(e) => setImprovedData({ ...improvedData, emergencyFund: Number(e.target.value) })}
          />
        </div>
        <button onClick={handleCompare} className="btn-primary">Compare Scenarios</button>
      </div>

      {comparison && (
        <div className="comparison-results">
          <div className="comparison-radars">
            <div className="comparison-radar">
              <h3>Current</h3>
              <RiskRadarChart scores={comparison.current.scores} />
              <div className="grade-badge" style={{ borderColor: comparison.current.grade.color }}>
                <span className="grade-letter" style={{ color: comparison.current.grade.color }}>
                  {comparison.current.grade.grade}
                </span>
              </div>
            </div>
            <div className="comparison-radar">
              <h3>Improved</h3>
              <RiskRadarChart scores={comparison.improved.scores} />
              <div className="grade-badge" style={{ borderColor: comparison.improved.grade.color }}>
                <span className="grade-letter" style={{ color: comparison.improved.grade.color }}>
                  {comparison.improved.grade.grade}
                </span>
              </div>
            </div>
          </div>

          <div className="improvements-list">
            <h3>Improvements</h3>
            {comparison.improvements.map((imp, i) => (
              <div key={i} className="improvement-item">
                <div className="improvement-dimension">{imp.dimension}</div>
                <div className="improvement-values">
                  <span>{imp.current.toFixed(0)}</span>
                  <span>→</span>
                  <span className={imp.gain > 0 ? 'positive' : ''}>{imp.improved.toFixed(0)}</span>
                  <span className={`improvement-gain ${imp.gain > 0 ? 'positive' : ''}`}>
                    ({imp.gain > 0 ? '+' : ''}{imp.gain.toFixed(0)})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
