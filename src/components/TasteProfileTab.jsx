import { Brain, TrendingUp, ThumbsUp, ThumbsDown, Target, Scissors, Users } from 'lucide-react';
import TasteCorrelation from './TasteCorrelation';
import GradeInflation from './GradeInflation';

const POPULARITY_BADGE = {
  'MAINSTREAM LOVER': { color: '#FFD93D', emoji: '📢' },
  'LEANS MAINSTREAM': { color: '#FFD93D', emoji: '📡' },
  'BALANCED': { color: '#4D96FF', emoji: '⚖️' },
  'LEANS NICHE': { color: '#C4B5FD', emoji: '🔍' },
  'HIDDEN GEM HUNTER': { color: '#6BCB77', emoji: '💎' },
  'NOT ENOUGH DATA': { color: '#A8E6CF', emoji: '❓' },
};

export default function TasteProfileTab({ tasteData, advancedStats }) {
  const { contrarian, gradeInflation, popularityBias, dropPoint } = advancedStats || {};
  const popBadge = POPULARITY_BADGE[popularityBias?.label] || POPULARITY_BADGE['NOT ENOUGH DATA'];

  return (
    <div className="tab-content">
      {/* Row 1: Taste Correlation + Grade Inflation */}
      <section className="section texture-halftone">
        <div className="container relative z-1">
          <div className="grid-2" style={{ gap: '2rem' }}>
            <TasteCorrelation tasteData={tasteData} />
            <GradeInflation data={gradeInflation} />
          </div>
        </div>
      </section>

      {/* Row 2: Popularity Bias + Drop Point */}
      <section className="section section-violet texture-dots">
        <div className="container relative z-1">
          <div className="stat-mini-grid">
            {/* Popularity Bias */}
            {popularityBias && (
              <div className="stat-mini stat-mini-muted">
                <div className="stat-mini-icon">{popBadge.emoji}</div>
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
                <div className="stat-mini-icon">✂️</div>
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

      {/* Row 3: Contrarian Score */}
      {contrarian && (contrarian.mostOverscored?.length > 0 || contrarian.mostUnderscored?.length > 0) && (
        <section className="section texture-grid">
          <div className="container relative z-1">
            <div className="neo-card">
              <div className="neo-card-header neo-card-header-secondary">
                <div
                  className="flex-center"
                  style={{ width: 36, height: 36, border: '3px solid #000', background: 'var(--neo-white)' }}
                >
                  <Target size={20} strokeWidth={3} />
                </div>
                <h3>CONTRARIAN SCORE</h3>
              </div>
              <div className="neo-card-body">
                <div className="grid-2" style={{ gap: '2rem' }}>
                  {/* You loved, others didn't */}
                  {contrarian.mostOverscored?.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '0.85rem', letterSpacing: '0.15em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ThumbsUp size={18} strokeWidth={3} />
                        YOUR GUILTY PLEASURES
                      </h4>
                      <div className="contrarian-list">
                        {contrarian.mostOverscored.map((c, i) => (
                          <div key={i} className="contrarian-card">
                            {c.coverImage && (
                              <img src={c.coverImage} alt="" className="contrarian-cover" loading="lazy" />
                            )}
                            <div className="contrarian-info">
                              <div className="contrarian-title">{c.title}</div>
                              <div className="contrarian-scores">
                                <span>You: <strong>{c.yourScore}/10</strong></span>
                                <span>Global: <strong>{c.globalScore}%</strong></span>
                              </div>
                            </div>
                            <div className="contrarian-diff" style={{ color: '#6BCB77' }}>
                              +{c.diff}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Others loved, you didn't */}
                  {contrarian.mostUnderscored?.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '0.85rem', letterSpacing: '0.15em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ThumbsDown size={18} strokeWidth={3} />
                        YOU WEREN'T IMPRESSED
                      </h4>
                      <div className="contrarian-list">
                        {contrarian.mostUnderscored.map((c, i) => (
                          <div key={i} className="contrarian-card">
                            {c.coverImage && (
                              <img src={c.coverImage} alt="" className="contrarian-cover" loading="lazy" />
                            )}
                            <div className="contrarian-info">
                              <div className="contrarian-title">{c.title}</div>
                              <div className="contrarian-scores">
                                <span>You: <strong>{c.yourScore}/10</strong></span>
                                <span>Global: <strong>{c.globalScore}%</strong></span>
                              </div>
                            </div>
                            <div className="contrarian-diff" style={{ color: '#FF6B6B' }}>
                              {c.diff}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Drop Point Distribution */}
      {dropPoint && dropPoint.distribution?.length > 0 && (
        <section className="section section-yellow texture-halftone">
          <div className="container relative z-1">
            <div className="neo-card">
              <div className="neo-card-header neo-card-header-accent">
                <div
                  className="flex-center"
                  style={{ width: 36, height: 36, border: '3px solid #000', background: 'var(--neo-white)' }}
                >
                  <Scissors size={20} strokeWidth={3} />
                </div>
                <h3>WHERE DO YOU DROP?</h3>
                <span className="neo-badge neo-badge-pill" style={{ background: 'var(--neo-white)', marginLeft: 'auto', fontSize: '0.7rem' }}>
                  {dropPoint.count} DROPPED
                </span>
              </div>
              <div className="neo-card-body">
                <div className="hype-bar-track" style={{ height: '40px' }}>
                  {dropPoint.distribution.map((d, i) => {
                    const total = dropPoint.distribution.reduce((s, x) => s + x.count, 0);
                    const pct = total > 0 ? (d.count / total) * 100 : 0;
                    const colors = ['#FF6B6B', '#FF922B', '#FFD93D', '#6BCB77'];
                    return pct > 0 ? (
                      <div
                        key={d.label}
                        className="hype-bar-seg"
                        style={{ flex: pct, background: colors[i % colors.length] }}
                        title={`${d.label}: ${d.count}`}
                      >
                        {pct > 12 && `${d.label}`}
                      </div>
                    ) : null;
                  })}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem', justifyContent: 'center' }}>
                  {dropPoint.distribution.map((d, i) => {
                    const colors = ['#FF6B6B', '#FF922B', '#FFD93D', '#6BCB77'];
                    return (
                      <span
                        key={d.label}
                        className="neo-badge"
                        style={{ background: colors[i % colors.length], fontSize: '0.65rem' }}
                      >
                        {d.label}: {d.count}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
