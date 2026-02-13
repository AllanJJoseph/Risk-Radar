export default function BehavioralDetector({ risks }) {
  if (!risks.detected) return null;

  return (
    <div className="feature-card behavioral-detector">
      <h2>🧠 Behavioral Spending Risk Detector</h2>
      <div className="behavioral-insights">
        {risks.insights.map((insight, i) => (
          <div key={i} className={`behavioral-insight behavioral-${insight.severity}`}>
            <div className="behavioral-pattern">{insight.pattern}</div>
            <div className="behavioral-message">{insight.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
