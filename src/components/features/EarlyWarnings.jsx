export default function EarlyWarnings({ warnings }) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="feature-card early-warnings">
      <h2>🚨 Early Warning Alerts Engine</h2>
      <div className="warnings-list">
        {warnings.map((warning, i) => (
          <div key={i} className={`warning-item warning-${warning.level}`}>
            <div className="warning-header">
              <span className="warning-level">{warning.level.toUpperCase()}</span>
              <span className="warning-category">{warning.category}</span>
            </div>
            <div className="warning-message">{warning.message}</div>
            <div className="warning-action">{warning.action}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
