import { NavLink } from 'react-router-dom';

const TABS = [
  { id: 'overview', label: 'OVERVIEW', link: '/stats', end: true },
  { id: 'genres', label: 'GENRES & TAGS', link: '/stats/genres' },
  { id: 'studios', label: 'STUDIOS & FORMATS', link: '/stats/studios' },
  { id: 'habits', label: 'WATCH HABITS', link: '/stats/habits' },
  { id: 'taste', label: 'TASTE PROFILE', link: '/stats/taste' },
  { id: 'timeline', label: 'TIMELINE', link: '/stats/timeline' },
];

export default function TabNav() {
  return (
    <nav className="tab-nav" aria-label="Stats navigation">
      <div className="tab-nav-inner">
        {TABS.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.link}
            end={tab.end}
            className={({ isActive }) => `tab-btn ${isActive ? 'tab-btn-active' : ''}`}
            role="tab"
          >
            <span className="tab-label">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export { TABS };
