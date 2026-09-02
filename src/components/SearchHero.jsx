import { useState } from 'react';
import { Search, Star, Zap, Shield } from 'lucide-react';

export default function SearchHero({ onSearch, isLoading }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (trimmed && !isLoading) {
      onSearch(trimmed);
    }
  };

  return (
    <section className="hero texture-halftone">
      {/* Decorative floating shapes */}
      <div className="hero-deco hero-deco-1" aria-hidden="true" />
      <div className="hero-deco hero-deco-2" aria-hidden="true" />
      <div className="hero-deco hero-deco-3" aria-hidden="true" />
      <div className="hero-deco hero-deco-4" aria-hidden="true" />

      {/* Floating decorative stars */}
      <Star
        className="hero-deco-star decorative-star"
        size={40}
        strokeWidth={3}
        style={{ top: '15%', right: '15%' }}
        aria-hidden="true"
      />
      <Star
        className="hero-deco-star decorative-star"
        size={28}
        strokeWidth={3}
        style={{ bottom: '20%', left: '20%', animationDelay: '-3s' }}
        aria-hidden="true"
      />
      <Star
        className="hero-deco-star decorative-star"
        size={20}
        strokeWidth={3}
        style={{ top: '40%', left: '8%', animationDelay: '-7s' }}
        aria-hidden="true"
      />

      {/* Title */}
      <div className="hero-title">
        <h1>
          <span className="hero-title-line">ANIME STATS</span>
          <span className="hero-title-line text-stroke-3" style={{ fontSize: '0.6em' }}>
            FOR NERDS
          </span>
        </h1>
        <p
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
            marginTop: '1rem',
            fontWeight: 700,
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Deep analytics on your AniList watch history. No signup required.
        </p>
      </div>

      {/* Search form */}
      <form className="hero-search" onSubmit={handleSubmit}>
        <label htmlFor="anilist-username" className="sr-only">
          AniList Username
        </label>
        <input
          id="anilist-username"
          type="text"
          className="neo-input"
          placeholder="Enter AniList username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          autoComplete="off"
          style={{ flex: 1 }}
        />
        <button
          type="submit"
          className="neo-btn neo-btn-primary neo-btn-lg"
          disabled={isLoading || !username.trim()}
          style={{ minWidth: '160px' }}
        >
          <Search size={20} strokeWidth={3} />
          {isLoading ? 'LOADING...' : 'ANALYZE'}
        </button>
      </form>

      {/* Badges */}
      <div className="hero-badges">
        <span className="neo-badge neo-badge-pill neo-badge-secondary" style={{ transform: 'rotate(-2deg)' }}>
          <Zap size={14} strokeWidth={3} />
          FREE
        </span>
        <span className="neo-badge neo-badge-pill neo-badge-muted" style={{ transform: 'rotate(1deg)' }}>
          <Shield size={14} strokeWidth={3} />
          NO API KEY
        </span>
        <span className="neo-badge neo-badge-pill neo-badge-accent" style={{ transform: 'rotate(3deg)' }}>
          <Star size={14} strokeWidth={3} />
          POWERED BY ANILIST
        </span>
      </div>
    </section>
  );
}
