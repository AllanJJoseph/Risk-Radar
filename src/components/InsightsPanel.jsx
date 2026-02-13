export default function InsightsPanel({ insights }) {
  if (!insights?.length) return null;

  const icon = (type) => {
    switch (type) {
      case 'success': return '✓';
      case 'warning': return '!';
      case 'info': return 'i';
      default: return '•';
    }
  };

  return (
    <div className="insights-panel">
      <h3>AI insights for you</h3>
      <ul>
        {insights.map((item, i) => (
          <li key={i} className={`insight insight-${item.type}`}>
            <span className="insight-icon" aria-hidden>{icon(item.type)}</span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
