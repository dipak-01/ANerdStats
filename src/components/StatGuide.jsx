import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

export default function StatGuide({ title = 'HOW TO READ THESE STATS', items = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!items || items.length === 0) return null;

  return (
    <div className="stat-guide-wrapper">
      <div className="container">
        <div className="stat-guide-card">
          <button
            type="button"
            className="stat-guide-header"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
          >
            <div className="stat-guide-header-left">
              <div className="flex-center stat-guide-icon-box">
                <HelpCircle size={18} strokeWidth={3} />
              </div>
              <span className="stat-guide-title">{title}</span>
              <span className="neo-badge neo-badge-pill neo-badge-secondary" style={{ fontSize: '0.65rem' }}>
                {items.length} STATS EXPLAINED
              </span>
            </div>
            <div className="stat-guide-header-right">
              <span className="stat-guide-toggle-label">
                {isOpen ? 'HIDE GUIDE' : 'SHOW GUIDE'}
              </span>
              {isOpen ? <ChevronUp size={18} strokeWidth={3} /> : <ChevronDown size={18} strokeWidth={3} />}
            </div>
          </button>

          {isOpen && (
            <div className="stat-guide-content">
              <div className="stat-guide-grid">
                {items.map((item, index) => (
                  <div key={index} className="stat-guide-item">
                    <div className="stat-guide-item-header">
                      {item.icon && <span className="stat-guide-item-icon">{item.icon}</span>}
                      <h4 className="stat-guide-item-name">{item.name}</h4>
                      {item.tag && (
                        <span className="neo-badge neo-badge-accent" style={{ fontSize: '0.6rem', marginLeft: 'auto' }}>
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <p className="stat-guide-item-desc">{item.what}</p>
                    {item.how && (
                      <div className="stat-guide-item-how">
                        <Lightbulb size={14} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: '2px', color: '#B45309' }} />
                        <span>{item.how}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
