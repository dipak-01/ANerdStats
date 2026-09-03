import { useState } from 'react';
import {
  Search, Star, Zap, Shield, Sparkles, Brain, Flame, Building2,
  Calendar, ArrowRight, History, X, ExternalLink,
} from 'lucide-react';

const SAMPLE_USERS = ['zilqnova', 'Zephyr', 'Nekomata'];

const FEATURES = [
  {
    icon: <Brain size={24} strokeWidth={2.5} />,
    title: 'Taste vs. The Crowd',
    desc: 'Scatter-plot your personal ratings against global consensus to spot guilty pleasures and critical disconnects.',
    tag: 'CORRELATION',
    color: '#C4B5FD',
  },
  {
    icon: <Flame size={24} strokeWidth={2.5} />,
    title: 'Binge Velocity & Hype Lag',
    desc: 'Measure your start-to-finish pacing and see how many years behind Japanese broadcast dates you watch.',
    tag: 'HABITS',
    color: '#FF6B6B',
  },
  {
    icon: <Building2 size={24} strokeWidth={2.5} />,
    title: 'Studio Loyalty & Formats',
    desc: 'Discover which animation studios own your library and your ratio of TV broadcast shows vs movies & OVAs.',
    tag: 'STUDIOS',
    color: '#FFD93D',
  },
  {
    icon: <Calendar size={24} strokeWidth={2.5} />,
    title: 'Anime Decades & Evolution',
    desc: 'Trace your dominant genres year-by-year and find out which historical decade defines your anime identity.',
    tag: 'TIMELINE',
    color: '#6BCB77',
  },
];

export default function SearchHero({ onSearch, isLoading }) {
  const [username, setUsername] = useState('');
  const [recents, setRecents] = useState(() => {
    try {
      const stored = localStorage.getItem('anerdstats_recents');
      return stored ? JSON.parse(stored).slice(0, 4) : [];
    } catch {
      return [];
    }
  });

  const handleExecuteSearch = (targetName) => {
    const trimmed = (targetName || username).trim();
    if (!trimmed || isLoading) return;

    // Save to recents
    try {
      const existing = recents.filter((n) => n.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...existing].slice(0, 4);
      setRecents(updated);
      localStorage.setItem('anerdstats_recents', JSON.stringify(updated));
    } catch {
      // ignore
    }

    onSearch(trimmed);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleExecuteSearch(username);
  };

  const handleSelectSample = (name) => {
    setUsername(name);
    handleExecuteSearch(name);
  };

  const handleClearInput = () => {
    setUsername('');
  };

  const handleClearRecents = (e) => {
    e.stopPropagation();
    setRecents([]);
    localStorage.removeItem('anerdstats_recents');
  };

  return (
    <div className="search-landing-page">
      {/* Top Navbar */}
      <header className="hero-navbar">
        <div className="container">
          <div className="hero-navbar-inner">
            <div className="hero-brand">
              <div className="hero-brand-logo">
                <Star size={18} strokeWidth={3} className="decorative-star" />
              </div>
              <span className="hero-brand-text">ANERDSTATS</span>
              <span className="neo-badge neo-badge-pill neo-badge-secondary" style={{ fontSize: '0.65rem' }}>
                v2.1
              </span>
            </div>

            <div className="hero-nav-actions">
              <a
                href="https://anilist.co"
                target="_blank"
                rel="noopener noreferrer"
                className="neo-btn neo-btn-outline hero-nav-btn"
              >
                <span>ANILIST.CO</span>
                <ExternalLink size={13} strokeWidth={3} />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Header Section */}
      <section className="hero texture-halftone">
        {/* Floating Decorative Shapes */}
        <div className="hero-deco hero-deco-1" aria-hidden="true" />
        <div className="hero-deco hero-deco-2" aria-hidden="true" />
        <div className="hero-deco hero-deco-3" aria-hidden="true" />
        <div className="hero-deco hero-deco-4" aria-hidden="true" />

        {/* Floating stars */}
        <Star className="hero-deco-star decorative-star" size={36} strokeWidth={3} style={{ top: '12%', right: '12%' }} aria-hidden="true" />
        <Star className="hero-deco-star decorative-star" size={24} strokeWidth={3} style={{ bottom: '18%', left: '16%', animationDelay: '-3s' }} aria-hidden="true" />
        <Star className="hero-deco-star decorative-star" size={18} strokeWidth={3} style={{ top: '35%', left: '6%', animationDelay: '-7s' }} aria-hidden="true" />

        <div className="container relative z-1">
          {/* Tagline Pill */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span
              className="neo-badge neo-badge-pill neo-badge-accent"
              style={{ fontSize: '0.75rem', padding: '0.4rem 1rem', transform: 'rotate(-1deg)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Sparkles size={14} strokeWidth={3} />
              DEEP ANILIST STATISTICAL ENGINE
            </span>
          </div>

          {/* Main Title */}
          <div className="hero-title">
            <h1>
              <span className="hero-title-line">ANIME STATS</span>
              <span className="hero-title-line text-stroke-3" style={{ fontSize: '0.62em' }}>
                FOR NERDS.
              </span>
            </h1>
            <p className="hero-subtitle">
              Turn your AniList profile into comprehensive statistical intelligence.
              Uncover rating discrepancies, binge habits, studio devotions, and franchise completion.
            </p>
          </div>

          {/* Search Box */}
          <form className="hero-search-box" onSubmit={handleSubmit}>
            <div className="hero-input-wrapper">
              <Search size={22} strokeWidth={3} className="hero-search-icon" />
              <input
                id="anilist-username"
                type="text"
                className="neo-input hero-input-field"
                placeholder="Enter AniList username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                autoComplete="off"
                autoFocus
              />
              {username && (
                <button
                  type="button"
                  onClick={handleClearInput}
                  className="hero-input-clear-btn"
                  aria-label="Clear input"
                >
                  <X size={18} strokeWidth={3} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="neo-btn neo-btn-primary hero-submit-btn"
              disabled={isLoading || !username.trim()}
            >
              <span>{isLoading ? 'ANALYZING...' : 'ANALYZE STATS'}</span>
              <ArrowRight size={20} strokeWidth={3} />
            </button>
          </form>

          {/* Samples & Recents */}
          <div className="hero-quick-picks">
            {/* Sample profiles */}
            <div className="quick-pick-group">
              <span className="quick-pick-label">TRY A SAMPLE:</span>
              <div className="quick-pick-pills">
                {SAMPLE_USERS.map((user) => (
                  <button
                    key={user}
                    type="button"
                    className="quick-pick-pill"
                    onClick={() => handleSelectSample(user)}
                    disabled={isLoading}
                  >
                    {user}
                  </button>
                ))}
              </div>
            </div>

            {/* Recents */}
            {recents.length > 0 && (
              <div className="quick-pick-group">
                <span className="quick-pick-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <History size={13} strokeWidth={2.5} />
                  RECENT:
                </span>
                <div className="quick-pick-pills">
                  {recents.map((user) => (
                    <button
                      key={user}
                      type="button"
                      className="quick-pick-pill quick-pick-recent"
                      onClick={() => handleSelectSample(user)}
                      disabled={isLoading}
                    >
                      {user}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="quick-pick-clear"
                    onClick={handleClearRecents}
                    title="Clear recent searches"
                  >
                    CLEAR
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Trust / Feature Badges */}
          <div className="hero-badges">
            <span className="neo-badge neo-badge-pill neo-badge-secondary" style={{ transform: 'rotate(-2deg)' }}>
              <Zap size={14} strokeWidth={3} />
              100% FREE
            </span>
            <span className="neo-badge neo-badge-pill neo-badge-muted" style={{ transform: 'rotate(1deg)' }}>
              <Shield size={14} strokeWidth={3} />
              ZERO SIGN-UP REQUIRED
            </span>
            <span className="neo-badge neo-badge-pill neo-badge-accent" style={{ transform: 'rotate(2deg)' }}>
              <Star size={14} strokeWidth={3} />
              FREE
            </span>
          </div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <div className="marquee-divider">
        <div className="marquee-inner">
          {'★ TASTE VS THE CROWD ★ BINGE VELOCITY ★ HYPE LAG INDEX ★ COMFORT REWATCH INDEX ★ GRADE INFLATION ★ STUDIO LOYALTY ★ POPULARITY BIAS ★ FRANCHISE COMPLETION ★ '
            .repeat(3)}
        </div>
      </div>

      {/* Feature Showcase Grid */}
      <section className="section section-black texture-dots">
        <div className="container relative z-1">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="neo-badge neo-badge-pill neo-badge-secondary" style={{ marginBottom: '0.75rem', fontSize: '0.75rem' }}>
              WHAT YOU WILL UNCOVER
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'var(--neo-white)', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
              BEYOND BASIC TOTALS & COUNTDOWNS
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '560px', margin: '0.5rem auto 0', fontSize: '0.95rem' }}>
              Standard AniList stats only count hours and episodes. AnerdStats performs advanced data science locally in your browser.
            </p>
          </div>

          <div className="hero-feature-grid">
            {FEATURES.map((feat, idx) => (
              <div key={idx} className="hero-feature-card">
                <div className="hero-feature-card-top">
                  <div
                    className="flex-center hero-feature-icon"
                    style={{ background: feat.color }}
                  >
                    {feat.icon}
                  </div>
                  <span className="neo-badge neo-badge-pill" style={{ fontSize: '0.65rem', background: 'var(--neo-white)' }}>
                    {feat.tag}
                  </span>
                </div>
                <h3 className="hero-feature-title">{feat.title}</h3>
                <p className="hero-feature-desc">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3-Step Strip */}
      <section className="section texture-grid" style={{ borderTop: 'var(--border-default)', background: 'var(--neo-bg)' }}>
        <div className="container relative z-1">
          <div className="hero-steps-grid">
            <div className="hero-step-box">
              <div className="hero-step-num">01</div>
              <h4 className="hero-step-title">ENTER USERNAME</h4>
              <p className="hero-step-text">Input any public AniList username. No password, no OAuth, no API keys needed.</p>
            </div>
            <div className="hero-step-box">
              <div className="hero-step-num">02</div>
              <h4 className="hero-step-title">BROWSER CRUNCH</h4>
              <p className="hero-step-text">Data is pulled via GraphQL and analyzed locally in milliseconds using zero server databases.</p>
            </div>
            <div className="hero-step-box">
              <div className="hero-step-num">03</div>
              <h4 className="hero-step-title">EXPLORE 6 TABS</h4>
              <p className="hero-step-text">Click into deep dive tabs, click titles to view individual dossiers, and check franchise progress.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>
            ANIME STATS FOR NERDS · Data fetched live from{' '}
            <a href="https://anilist.co" target="_blank" rel="noopener noreferrer">
              AniList GraphQL API
            </a>
          </p>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem', opacity: 0.6 }}>
            NOT AFFILIATED WITH ANILIST. ALL DATA IS PUBLICLY AVAILABLE.
          </p>
        </div>
      </footer>
    </div>
  );
}
