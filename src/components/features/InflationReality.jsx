export default function InflationReality({ impact }) {
  if (!impact) return null;

  return (
    <div className="feature-card inflation-reality">
      <h2>🪙 Inflation Reality Check</h2>
      <div className="inflation-content">
        <div className="inflation-message">{impact.message}</div>
        <div className="inflation-stats">
          <div className="inflation-stat">
            <span className="stat-label">Current Value:</span>
            <span className="stat-value">₹{impact.currentAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="inflation-stat">
            <span className="stat-label">Future Value ({impact.years} years):</span>
            <span className="stat-value">₹{impact.futureValue.toLocaleString('en-IN')}</span>
          </div>
          <div className="inflation-stat">
            <span className="stat-label">Purchasing Power:</span>
            <span className="stat-value">{impact.purchasingPower}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
