export default function PersonaCard({ persona }) {
  if (!persona) return null;

  const personaEmojis = {
    'Safe Builder': '🏆',
    'EMI Struggler': '⚠️',
    'Growth Planner': '📈',
    'Risk Exposed': '🚨',
  };

  return (
    <div className="feature-card persona-card">
      <h2>🎯 Financial Stability Score + Persona</h2>
      <div className="persona-content">
        <div className="persona-main">
          <div className="persona-icon">{personaEmojis[persona.persona] || '👤'}</div>
          <div className="persona-info">
            <div className="persona-name">{persona.persona}</div>
            <div className="persona-description">{persona.description}</div>
            <div className="persona-score">
              Stability Score: <strong>{persona.stabilityScore}/100</strong>
            </div>
          </div>
        </div>
        
        <div className="persona-traits">
          <div className="trait">
            <span className="trait-label">Emergency Fund:</span>
            <span className={`trait-value trait-${persona.traits.emergencyFund.toLowerCase()}`}>
              {persona.traits.emergencyFund}
            </span>
          </div>
          <div className="trait">
            <span className="trait-label">Debt Management:</span>
            <span className={`trait-value trait-${persona.traits.debtManagement.toLowerCase()}`}>
              {persona.traits.debtManagement}
            </span>
          </div>
          <div className="trait">
            <span className="trait-label">Savings Discipline:</span>
            <span className={`trait-value trait-${persona.traits.savingsDiscipline.toLowerCase().replace(' ', '-')}`}>
              {persona.traits.savingsDiscipline}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
