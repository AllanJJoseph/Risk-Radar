export default function JourneyTracker({ milestones, badges }) {
  return (
    <div className="feature-card journey-tracker">
      <h2>🧩 Financial Health Journey Tracker</h2>
      
      <div className="journey-section">
        <h3>Milestones Unlocked</h3>
        {milestones.length === 0 ? (
          <p className="no-items">No milestones unlocked yet. Keep improving!</p>
        ) : (
          <div className="milestones-grid">
            {milestones.map((m, i) => (
              <div key={i} className="milestone-item">
                <div className="milestone-icon">🏅</div>
                <div className="milestone-info">
                  <div className="milestone-name">{m.name || m.type}</div>
                  <div className="milestone-desc">{m.description}</div>
                  {m.unlockedAt && (
                    <div className="milestone-date">
                      Unlocked: {new Date(m.unlockedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="journey-section">
        <h3>Badges Earned</h3>
        {badges.length === 0 ? (
          <p className="no-items">No badges earned yet. Keep building your financial health!</p>
        ) : (
          <div className="badges-grid">
            {badges.map((b, i) => (
              <div key={i} className="badge-item">
                <div className="badge-icon">⭐</div>
                <div className="badge-info">
                  <div className="badge-name">{b.name}</div>
                  <div className="badge-desc">{b.description}</div>
                  {b.earnedAt && (
                    <div className="badge-date">
                      Earned: {new Date(b.earnedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
