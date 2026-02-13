import { useState } from 'react';
import { simulateLifeEvent } from '../../lib/enhancedRiskEngine';

export default function LifeEventSimulator({ currentData }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [simulation, setSimulation] = useState(null);

  const events = [
    { id: 'medical_emergency', label: 'Medical Emergency (₹5L)' },
    { id: 'job_loss', label: 'Job Loss' },
    { id: 'wedding_expense', label: 'Wedding Expense (₹10L)' },
    { id: 'inflation_spike', label: 'Inflation Spike (15%)' },
  ];

  const handleSimulate = (eventType) => {
    const result = simulateLifeEvent(currentData, eventType);
    setSimulation(result);
    setSelectedEvent(eventType);
  };

  return (
    <div className="feature-card">
      <h2>🇮🇳 Indian Life Event Stress Simulator</h2>
      <p className="feature-description">See how common life events impact your financial health</p>
      
      <div className="event-buttons">
        {events.map(event => (
          <button
            key={event.id}
            onClick={() => handleSimulate(event.id)}
            className={`event-btn ${selectedEvent === event.id ? 'active' : ''}`}
          >
            {event.label}
          </button>
        ))}
      </div>

      {simulation && (
        <div className="simulation-results">
          <h3>{simulation.event}</h3>
          <p className="simulation-desc">{simulation.description}</p>
          
          <div className="impact-grid">
            {simulation.impact.map((imp, i) => (
              <div key={i} className="impact-item">
                <div className="impact-dimension">{imp.dimension}</div>
                <div className="impact-values">
                  <span className="impact-before">{imp.before.toFixed(0)}</span>
                  <span className="impact-arrow">→</span>
                  <span className={`impact-after ${imp.change < 0 ? 'negative' : ''}`}>
                    {imp.after.toFixed(0)}
                  </span>
                </div>
                <div className={`impact-change ${imp.change < 0 ? 'negative' : 'positive'}`}>
                  {imp.change > 0 ? '+' : ''}{imp.change.toFixed(0)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
