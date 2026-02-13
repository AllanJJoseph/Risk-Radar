export default function SmartInsights({ insights }) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="feature-card smart-insights">
      <h2>🧑‍🏫 Smart Insight Explanations</h2>
      <div className="smart-insights-list">
        {insights.map((insight, i) => (
          <div key={i} className={`smart-insight smart-insight-${insight.priority}`}>
            <div className="smart-insight-header">
              <span className="smart-insight-dimension">{insight.dimension}</span>
              <span className={`smart-insight-priority priority-${insight.priority}`}>
                {insight.priority.toUpperCase()}
              </span>
            </div>
            <div className="smart-insight-score">Score: {insight.score}/100</div>
            <div className="smart-insight-explanation">
              <strong>Why:</strong> {insight.explanation}
            </div>
            <div className="smart-insight-fix">
              <strong>How to fix:</strong> {insight.fix}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
