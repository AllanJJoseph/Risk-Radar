import { useState } from 'react';
import { estimateActionImpact } from '../../lib/enhancedRiskEngine';

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
      )}
    </div>
  );
}
