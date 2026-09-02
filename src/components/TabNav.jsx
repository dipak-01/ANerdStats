import { useState } from 'react';

const TABS = [
  { id: 'overview', label: 'OVERVIEW', icon: '📊' },
  { id: 'genres', label: 'GENRES & TAGS', icon: '🎭' },
  { id: 'studios', label: 'STUDIOS & FORMATS', icon: '🏢' },
  { id: 'habits', label: 'WATCH HABITS', icon: '🔥' },
  { id: 'taste', label: 'TASTE PROFILE', icon: '🧠' },
  { id: 'timeline', label: 'TIMELINE', icon: '📅' },
];

export default function TabNav({ activeTab, onTabChange }) {
  return (
    <nav className="tab-nav" aria-label="Stats navigation">
      <div className="tab-nav-inner">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'tab-btn-active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            <span className="tab-icon" aria-hidden="true">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export { TABS };
