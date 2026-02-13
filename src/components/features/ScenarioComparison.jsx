import { useState, useMemo } from 'react';
import { compareScenarios } from '../../lib/enhancedRiskEngine';
import RiskRadarChart from '../RiskRadarChart';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

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

  const barData = useMemo(() => {
    if (!comparison) return null;
    return {
      labels: comparison.improvements.map((imp) => imp.dimension),
      datasets: [
        {
          label: 'Current',
          data: comparison.improvements.map((imp) => imp.current),
          backgroundColor: 'rgba(148, 163, 184, 0.7)',
        },
        {
          label: 'Improved',
          data: comparison.improvements.map((imp) => imp.improved),
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
        },
      ],
    };
  }, [comparison]);

  const barOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#e5e7eb',
            font: { size: 11 },
          },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.raw.toFixed(0)}/100`,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#9ca3af',
            font: { size: 10 },
          },
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20,
            color: '#6b7280',
          },
          grid: {
            color: 'rgba(75, 85, 99, 0.4)',
          },
        },
      },
    }),
    []
  );

  const doughnutData = useMemo(() => {
    if (!comparison) return null;
    const current = comparison.overallGain.current;
    const improved = comparison.overallGain.improved;
    return {
      labels: ['Current', 'Improved'],
      datasets: [
        {
          data: [current, improved],
          backgroundColor: ['rgba(148, 163, 184, 0.8)', 'rgba(16, 185, 129, 0.9)'],
          borderColor: ['rgba(31, 41, 55, 1)', 'rgba(31, 41, 55, 1)'],
          borderWidth: 2,
        },
      ],
    };
  }, [comparison]);

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
          <div className="comparison-top">
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

            {doughnutData && (
              <div className="comparison-doughnut">
                <h3>Overall Stability</h3>
                <div className="doughnut-wrap">
                  <Doughnut data={doughnutData} />
                </div>
              </div>
            )}
          </div>

          <div className="improvements-list">
            <h3>Improvements by Dimension</h3>

            <div className="improvements-layout">
              <div className="improvements-chart">
                {barData && (
                  <div className="bar-chart-wrap">
                    <Bar data={barData} options={barOptions} />
                  </div>
                )}
              </div>

              <div className="improvements-list-items">
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
          </div>
        </div>
      )}
    </div>
  );
}
