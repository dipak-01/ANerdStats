import {
  ThumbsUp, ThumbsDown, Target, Scissors, Megaphone, Radio, Scale, Sparkles, Gem, HelpCircle,
} from 'lucide-react';
import AnimeLink from './AnimeLink';
import TasteCorrelation from './TasteCorrelation';
import GradeInflation from './GradeInflation';
import StatGuide from './StatGuide';

const TASTE_GUIDE = [
  {
    name: 'Taste vs. The Crowd (Correlation)',
    tag: 'CORRELATION',
    what: 'Scatter plot comparing your score directly against the global AniList community average for every scored show.',
    how: 'Dots plotted above the diagonal line are shows you appreciated more than the crowd; dots below are shows you judged harsher.',
  },
  {
    name: 'Rating Style Disposition',
    tag: 'DISPOSITION',
    what: 'Categorizes your grading behavior (Generous, Balanced, or Harsh Critic) based on your net score delta from global consensus.',
    how: 'Average difference > +5 points identifies a lenient, enthusiastic rater; < -5 points indicates a strict, analytical critic.',
  },
  {
    name: 'Grade Inflation Over Time',
    tag: 'SCORING TREND',
    what: 'Plots your annual mean score according to the calendar year you started each series.',
    how: 'An ascending slope reveals you are growing more generous over time; a descending slope means your standards are becoming more rigorous.',
  },
  {
    name: 'Popularity Bias (Hipster Index)',
    tag: 'MAINSTREAM BIAS',
    what: 'Pearson correlation coefficient measuring whether popular titles systematically receive higher or lower scores from you.',
    how: 'Positive correlation = Mainstream Fan (you enjoy widely hyped hits); Negative correlation = Hidden Gem Hunter (you favor niche, under-the-radar titles).',
  },
  {
    name: 'Drop Point Analysis',
    tag: 'PATIENCE',
    what: 'Calculates the average percentage of total episodes you completed before deciding to mark a series as DROPPED.',
    how: 'Drop point ≤ 25% represents a strict 3-episode rule; drop point ≥ 50% shows deep patience and generous second chances.',
  },
  {
    name: 'Contrarian Outliers (Loved vs Underwhelmed)',
    tag: 'DIVERGENCE',
    what: 'Your most extreme positive divergences (shows you loved that the world slept on) and negative divergences (popular darlings you disliked).',
    how: 'Defines your unique, idiosyncratic taste identity where you disagree most passionately with the general anime community.',
  },
];

const POPULARITY_BADGE = {
  'MAINSTREAM LOVER': { color: '#FFD93D', icon: Megaphone },
  'LEANS MAINSTREAM': { color: '#FFD93D', icon: Radio },
  'BALANCED': { color: '#4D96FF', icon: Scale },
  'LEANS NICHE': { color: '#C4B5FD', icon: Sparkles },
  'HIDDEN GEM HUNTER': { color: '#6BCB77', icon: Gem },
  'NOT ENOUGH DATA': { color: '#A8E6CF', icon: HelpCircle },
};

export default function TasteProfileTab({ tasteData, advancedStats }) {
  const { contrarian, gradeInflation, popularityBias, dropPoint } = advancedStats || {};
  const popBadge = POPULARITY_BADGE[popularityBias?.label] || POPULARITY_BADGE['NOT ENOUGH DATA'];
  const PopIcon = popBadge.icon;

  return (
    <div className="tab-content">
      {/* Stat Explainer Guide */}
      <StatGuide title="TASTE PROFILE GUIDE: WHAT THESE METRICS REVEAL" items={TASTE_GUIDE} />

      {/* Row 1: Taste Correlation */}
      <section className="section texture-halftone">
        <div className="container relative z-1">
          <TasteCorrelation tasteData={tasteData} />
        </div>
      </section>

      {/* Row 2: Grade Inflation */}
      <section className="section texture-dots">
        <div className="container relative z-1">
          <GradeInflation data={gradeInflation} />
        </div>
      </section>

      {/* Row 3: Popularity Bias + Drop Point */}
      <section className="section section-violet texture-dots">
        <div className="container relative z-1">
          <div className="stat-mini-grid">
            {/* Popularity Bias */}
            {popularityBias && (
              <div className="stat-mini stat-mini-muted">
                <div className="stat-mini-icon">
                  <PopIcon size={28} strokeWidth={2.5} />
                </div>
                <div className="stat-mini-value" style={{ color: popBadge.color, fontSize: '1.25rem' }}>
                  {popularityBias.label}
                </div>
                <div className="stat-mini-label">POPULARITY BIAS</div>
                <div className="stat-mini-sub">
                  Correlation: <strong>{popularityBias.correlation !== null ? popularityBias.correlation : 'N/A'}</strong>
                  {' · '}{popularityBias.count} scored titles
                </div>
              </div>
            )}

            {/* Drop Point Analysis */}
            {dropPoint && dropPoint.avgDropPercent !== null && (
              <div className="stat-mini stat-mini-accent">
                <div className="stat-mini-icon">
                  <Scissors size={28} strokeWidth={2.5} />
                </div>
                <div className="stat-mini-value" style={{ color: 'var(--neo-accent)' }}>
                  {dropPoint.avgDropPercent}%
                </div>
                <div className="stat-mini-label">AVG DROP POINT</div>
                <div className="stat-mini-sub">
                  {dropPoint.count} dropped · {dropPoint.avgDropPercent <= 25 ? 'Quick to cut losses' : dropPoint.avgDropPercent <= 50 ? 'Gives things a fair chance' : 'Persistent but not infinite patience'}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Row 4: Contrarian Score */}
      {contrarian && (contrarian.mostOverscored?.length > 0 || contrarian.mostUnderscored?.length > 0) && (
        <section className="section texture-grid">
          <div className="container relative z-1">
            <div className="grid-2" style={{ gap: '2rem' }}>
              {/* Most Overscored */}
              {contrarian.mostOverscored?.length > 0 && (
                <div className="neo-card">
                  <div className="neo-card-header neo-card-header-secondary">
                    <div
                      className="flex-center"
                      style={{ width: 36, height: 36, border: '3px solid #000', background: 'var(--neo-white)' }}
                    >
                      <ThumbsUp size={20} strokeWidth={3} />
                    </div>
                    <div>
                      <h3>LOVED MORE THAN THE CROWD</h3>
                      <p style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.7 }}>YOUR BIGGEST GUILTY PLEASURES</p>
                    </div>
                  </div>
                  <div className="neo-card-body">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {contrarian.mostOverscored.map((c) => (
                        <div key={c.id || c.title} className="contrarian-card">
                          {c.coverImage && (
                            <img src={c.coverImage} alt="" className="contrarian-cover" loading="lazy" />
                          )}
                          <div className="contrarian-info">
                            <div className="contrarian-title"><AnimeLink id={c.id}>{c.title}</AnimeLink></div>
                            <div className="contrarian-scores">
                              <span>You: <strong>{c.yourScore}/10</strong></span>
                              <span>Global: <strong>{c.globalScore}%</strong></span>
                            </div>
                          </div>
                          <div className="contrarian-diff contrarian-diff-pos">
                            +{c.diff}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Most Underscored */}
              {contrarian.mostUnderscored?.length > 0 && (
                <div className="neo-card">
                  <div className="neo-card-header neo-card-header-accent">
                    <div
                      className="flex-center"
                      style={{ width: 36, height: 36, border: '3px solid #000', background: 'var(--neo-white)' }}
                    >
                      <ThumbsDown size={20} strokeWidth={3} />
                    </div>
                    <div>
                      <h3>UNDERWHELMED YOU</h3>
                      <p style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.7 }}>EVERYONE LOVED IT EXCEPT YOU</p>
                    </div>
                  </div>
                  <div className="neo-card-body">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {contrarian.mostUnderscored.map((c) => (
                        <div key={c.id || c.title} className="contrarian-card">
                          {c.coverImage && (
                            <img src={c.coverImage} alt="" className="contrarian-cover" loading="lazy" />
                          )}
                          <div className="contrarian-info">
                            <div className="contrarian-title"><AnimeLink id={c.id}>{c.title}</AnimeLink></div>
                            <div className="contrarian-scores">
                              <span>You: <strong>{c.yourScore}/10</strong></span>
                              <span>Global: <strong>{c.globalScore}%</strong></span>
                            </div>
                          </div>
                          <div className="contrarian-diff contrarian-diff-neg">
                            {c.diff}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Row 5: Where do you drop? */}
      {dropPoint && dropPoint.drops?.length > 0 && (
        <section className="section texture-dots">
          <div className="container relative z-1">
            <div className="neo-card">
              <div className="neo-card-header neo-card-header-muted">
                <div
                  className="flex-center"
                  style={{ width: 36, height: 36, border: '3px solid #000', background: 'var(--neo-white)' }}
                >
                  <Target size={20} strokeWidth={3} />
                </div>
                <h3>WHERE DO YOU DROP?</h3>
                <span className="neo-badge neo-badge-pill neo-badge-accent" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
                  {dropPoint.count} TITLES
                </span>
              </div>
              <div className="neo-card-body">
                <div className="hype-lag-bar-container">
                  {dropPoint.distribution?.map((d) => (
                    <div
                      key={d.label}
                      className="hype-lag-bar-segment"
                      style={{
                        flex: Math.max(d.count, 0.5),
                        backgroundColor: d.color,
                      }}
                      title={`${d.label}: ${d.count}`}
                    >
                      {d.count > 0 && <span>{d.count}</span>}
                    </div>
                  ))}
                </div>
                <div className="hype-lag-legend">
                  {dropPoint.distribution?.map((d) => (
                    <div key={d.label} className="hype-lag-legend-item">
                      <div className="hype-lag-legend-dot" style={{ backgroundColor: d.color }} />
                      <span>{d.label} ({d.count})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
