import { Star, ArrowLeft } from 'lucide-react';
import OverviewCards from './OverviewCards';
import GenreChart from './GenreChart';
import ScoreDistribution from './ScoreDistribution';
import StudioBreakdown from './StudioBreakdown';
import TagCloud from './TagCloud';
import YearTimeline from './YearTimeline';
import FormatBreakdown from './FormatBreakdown';
import StatusBreakdown from './StatusBreakdown';
import BingeStats from './BingeStats';
import TasteCorrelation from './TasteCorrelation';

export default function Dashboard({ userStats, allEntries, overviewStats, bingeData, tasteData, onBack }) {
  const user = userStats;
  const anime = user?.statistics?.anime;

  if (!anime) return null;

  return (
    <div>
      {/* Dashboard Header */}
      <header className="dash-header texture-grid">
        <div className="container">
          <div className="dash-header-inner">
            <div className="dash-user">
              <button
                className="neo-btn neo-btn-outline"
                onClick={onBack}
                aria-label="Go back to search"
                style={{ padding: '0.5rem' }}
              >
                <ArrowLeft size={24} strokeWidth={3} />
              </button>
              {user.avatar?.large && (
                <img
                  src={user.avatar.large}
                  alt={`${user.name}'s avatar`}
                  className="dash-avatar"
                />
              )}
              <div>
                <h2 className="dash-username">{user.name}</h2>
                <span
                  className="neo-badge neo-badge-pill neo-badge-accent"
                  style={{ transform: 'rotate(-1deg)' }}
                >
                  STATS FOR NERDS
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={24} strokeWidth={3} className="decorative-star" />
              <span style={{ fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                POWERED BY ANILIST
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Marquee Divider */}
      <div className="marquee-divider">
        <div className="marquee-inner">
          {'★ ANIME STATS ★ GENRE BREAKDOWN ★ STUDIO RANKINGS ★ BINGE ANALYSIS ★ TASTE CORRELATION ★ SCORE DISTRIBUTION ★ TAG CLOUD ★ RELEASE TIMELINE ★ '
            .repeat(3)}
        </div>
      </div>

      {/* Overview Cards */}
      <section className="section texture-halftone">
        <div className="container relative z-1">
          <OverviewCards stats={overviewStats} />
        </div>
      </section>

      {/* Score Distribution + Genre */}
      <section className="section section-yellow texture-dots">
        <div className="container relative z-1">
          <div className="grid-2" style={{ gap: '2rem' }}>
            <ScoreDistribution entries={allEntries} />
            <GenreChart genres={anime.genres} />
          </div>
        </div>
      </section>

      {/* Studio + Format + Status */}
      <section className="section texture-grid">
        <div className="container relative z-1">
          <div className="grid-3" style={{ gap: '2rem' }}>
            <StudioBreakdown studios={anime.studios} />
            <FormatBreakdown formats={anime.formats} />
            <StatusBreakdown statuses={anime.statuses} />
          </div>
        </div>
      </section>

      {/* Tags + Year Timeline */}
      <section className="section section-violet texture-halftone">
        <div className="container relative z-1">
          <div className="grid-2" style={{ gap: '2rem' }}>
            <TagCloud tags={anime.tags} />
            <YearTimeline releaseYears={anime.releaseYears} />
          </div>
        </div>
      </section>

      {/* Derived Stats: Binge + Taste */}
      <section className="section texture-dots">
        <div className="container relative z-1">
          <div className="grid-2" style={{ gap: '2rem' }}>
            <BingeStats bingeData={bingeData} />
            <TasteCorrelation tasteData={tasteData} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>
            ANIME STATS FOR NERDS · Data from{' '}
            <a href="https://anilist.co" target="_blank" rel="noopener noreferrer">
              AniList
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


