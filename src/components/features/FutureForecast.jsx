export default function FutureForecast({ forecast }) {
  if (!forecast) return null;

  return (
    <div className="feature-card">
      <h2>🔮 Future Risk Forecast (6 months ahead)</h2>
      <div className="forecast-content">
        <div className="forecast-warnings">
          {forecast.warnings.map((w, i) => (
            <div key={i} className={`forecast-warning forecast-warning-${w.type}`}>
              <strong>{w.message}</strong>
              <p>{w.timeline}</p>
            </div>
          ))}
        </div>

        <div className="forecast-changes">
          <h3>Projected Changes</h3>
          <div className="changes-grid">
            {forecast.changes.map((change, i) => (
              <div key={i} className="change-item">
                <div className="change-label">{change.dimension}</div>
                <div className="change-values">
                  <span className="change-current">{change.current.toFixed(0)}</span>
                  <span className="change-arrow">→</span>
                  <span className={`change-projected ${change.change < 0 ? 'negative' : 'positive'}`}>
                    {change.projected.toFixed(0)}
                  </span>
                </div>
                <div className={`change-delta ${change.change < 0 ? 'negative' : 'positive'}`}>
                  {change.change > 0 ? '+' : ''}{change.change.toFixed(0)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
