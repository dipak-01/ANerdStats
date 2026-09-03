import { useState } from 'react';
import { Star, ArrowLeft } from 'lucide-react';
import OverviewCards from './OverviewCards';
import TabNav from './TabNav';
import ScoreDistribution from './ScoreDistribution';
import GenreChart from './GenreChart';
import TagCloud from './TagCloud';
import StudioBreakdown from './StudioBreakdown';
import FormatBreakdown from './FormatBreakdown';
import StatusBreakdown from './StatusBreakdown';
import WatchHabitsTab from './WatchHabitsTab';
import TasteProfileTab from './TasteProfileTab';
import TimelineTab from './TimelineTab';
import YearTimeline from './YearTimeline';
import AnimeDecade from './AnimeDecade';

export default function Dashboard({ userStats, allEntries, overviewStats, bingeData, tasteData, advancedStats, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const user = userStats;
  const anime = user?.statistics?.anime;

  if (!anime) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {/* Score Distribution + Score Volatility */}
            <section className="section section-yellow texture-dots">
              <div className="container relative z-1">
                <div className="grid-2" style={{ gap: '2rem' }}>
                  <ScoreDistribution entries={allEntries} />
                  <GenreChart genres={anime.genres} />
                </div>
              </div>
            </section>
          </>
        );
      case 'genres':
        return (
          <>
            <section className="section texture-halftone">
              <div className="container relative z-1">
                <GenreChart genres={anime.genres} />
              </div>
            </section>
            <section className="section section-violet texture-dots">
              <div className="container relative z-1">
                <TagCloud tags={anime.tags} />
              </div>
            </section>
            {/* Genre Evolution inside Timeline tab but also relevant here */}
            {advancedStats?.genreEvolution?.length > 0 && (
              <section className="section texture-grid">
                <div className="container relative z-1">
                  <div className="neo-card">
                    <div className="neo-card-header neo-card-header-accent">
                      <div
                        className="flex-center"
                        style={{ width: 36, height: 36, border: '3px solid #000', background: 'var(--neo-white)' }}
                      >
                        <span style={{ fontSize: '1.1rem' }}>🎭</span>
                      </div>
                      <h3>GENRE EVOLUTION</h3>
                    </div>
                    <div className="neo-card-body">
                      <p style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Your dominant genre each year you started watching
                      </p>
                      <div className="table-scroll">
                        <table className="neo-table">
                          <thead>
                            <tr>
                              <th>YEAR</th>
                              <th>TOP GENRE</th>
                              <th>COUNT</th>
                              <th>TOTAL</th>
                            </tr>
                          </thead>
                          <tbody>
                            {advancedStats.genreEvolution.map((row) => (
                              <tr key={row.year}>
                                <td><span className="rank-number" style={{ fontSize: '1rem' }}>{row.year}</span></td>
                                <td><span className="neo-badge neo-badge-accent" style={{ fontSize: '0.7rem' }}>{row.topGenre}</span></td>
                                <td>{row.topCount}</td>
                                <td>{row.totalShows}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </>
        );
      case 'studios':
        return (
          <section className="section texture-halftone">
            <div className="container relative z-1">
              <div className="grid-3" style={{ gap: '2rem' }}>
                <StudioBreakdown studios={anime.studios} />
                <FormatBreakdown formats={anime.formats} />
                <StatusBreakdown statuses={anime.statuses} />
              </div>
              {/* Studio Loyalty mini card */}
              {overviewStats?.studioLoyalty && (
                <div style={{ marginTop: '2rem' }}>
                  <div className="stat-mini stat-mini-muted" style={{ maxWidth: '400px', margin: '0 auto' }}>
                    <div className="stat-mini-icon">🏢</div>
                    <div className="stat-mini-value" style={{ color: 'var(--neo-muted)', fontSize: '1.25rem' }}>
                      {overviewStats.studioLoyalty.name}
                    </div>
                    <div className="stat-mini-label">MOST WATCHED STUDIO</div>
                    <div className="stat-mini-sub">
                      {overviewStats.studioLoyalty.count} titles · {overviewStats.studioLoyalty.percent}% of your library
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      case 'habits':
        return (
          <WatchHabitsTab
            bingeData={bingeData}
            overviewStats={overviewStats}
            advancedStats={advancedStats}
          />
        );
      case 'taste':
        return (
          <TasteProfileTab
            tasteData={tasteData}
            advancedStats={advancedStats}
          />
        );
      case 'timeline':
        return (
          <TimelineTab
            releaseYears={anime.releaseYears}
            decadeData={advancedStats?.decade}
            genreEvolution={advancedStats?.genreEvolution}
          />
        );
      default:
        return null;
    }
  };

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

      {/* Overview Cards — Always pinned above tabs */}
      <section className="section texture-halftone">
        <div className="container relative z-1">
          <OverviewCards stats={overviewStats} />
        </div>
      </section>

      {/* Tab Navigation */}
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      {renderTabContent()}

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
