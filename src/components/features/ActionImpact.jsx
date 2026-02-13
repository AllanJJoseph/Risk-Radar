import { useState, useMemo } from 'react';
import { estimateActionImpact } from '../../lib/enhancedRiskEngine';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ActionImpact({ currentData }) {
  const [actionType, setActionType] = useState('increase_savings');
  const [actionAmount, setActionAmount] = useState(5000);
  const [impact, setImpact] = useState(null);

  const actions = [
    { id: 'increase_savings', label: 'Increase Monthly Savings', unit: '₹' },
    { id: 'reduce_emi', label: 'Reduce Monthly EMI', unit: '₹' },
    { id: 'increase_emergency_fund', label: 'Add to Emergency Fund', unit: '₹' },
    { id: 'increase_insurance', label: 'Increase Insurance', unit: '₹', subType: 'life' },
    { id: 'adjust_equity', label: 'Adjust Equity Allocation', unit: '%' },
  ];

  const handleEstimate = () => {
    const action = {
      type: actionType,
      amount: actionAmount,
      description: actions.find(a => a.id === actionType)?.label,
    };

    if (actionType === 'increase_insurance') {
      action.insuranceType = 'life';
    }
    if (actionType === 'adjust_equity') {
      action.percent = actionAmount;
    }

    const result = estimateActionImpact(currentData, action);
    setImpact(result);
  };

  const barData = useMemo(() => {
    if (!impact) return null;
    return {
      labels: impact.impact.map((imp) => imp.dimension),
      datasets: [
        {
          label: 'Before',
          data: impact.impact.map((imp) => imp.before),
          backgroundColor: 'rgba(148, 163, 184, 0.8)',
        },
        {
          label: 'After',
          data: impact.impact.map((imp) => imp.after),
          backgroundColor: 'rgba(16, 185, 129, 0.85)',
        },
      ],
    };
  }, [impact]);

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

  return (
    <div className="feature-card action-impact">
      <h2>🧭 Action Impact Estimator</h2>
      <p className="feature-description">See how specific actions improve your financial health</p>
      
      <div className="action-selector">
        <select value={actionType} onChange={(e) => setActionType(e.target.value)}>
          {actions.map(a => (
            <option key={a.id} value={a.id}>{a.label}</option>
          ))}
        </select>
        <input
          type="number"
          value={actionAmount}
          onChange={(e) => setActionAmount(Number(e.target.value))}
          placeholder="Amount"
        />
        <button onClick={handleEstimate} className="btn-primary">Estimate Impact</button>
      </div>

      {impact && (
        <div className="impact-results">
          <h3>Impact of: {impact.action}</h3>
          <div className="impact-summary">
            <div className="impact-before">
              <span>Before:</span>
              <strong>{impact.overallImprovement.before.toFixed(0)}/100</strong>
            </div>
            <div className="impact-arrow">→</div>
            <div className="impact-after">
              <span>After:</span>
              <strong>{impact.overallImprovement.after.toFixed(0)}/100</strong>
            </div>
            <div className="impact-gain">
              Gain: <strong>+{(impact.overallImprovement.after - impact.overallImprovement.before).toFixed(0)}</strong>
            </div>
          </div>

          <div className="impact-visuals">
            <div className="impact-chart">
              {barData && (
                <div className="bar-chart-wrap">
                  <Bar data={barData} options={barOptions} />
                </div>
              )}
            </div>

            <div className="impact-details">
              {impact.impact.map((imp, i) => (
                <div key={i} className="impact-detail-item">
                  <div className="impact-dimension">{imp.dimension}</div>
                  <div className="impact-values">
                    <span>{imp.before.toFixed(0)}</span>
                    <span>→</span>
                    <span className={imp.improvement > 0 ? 'positive' : ''}>{imp.after.toFixed(0)}</span>
                    <span className={`impact-improvement ${imp.improvement > 0 ? 'positive' : ''}`}>
                      {imp.improvement > 0 ? '+' : ''}{imp.improvement.toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
