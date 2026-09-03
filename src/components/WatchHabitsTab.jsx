import { CalendarDays, Clock, RotateCcw, ClipboardList, Film, Sparkles, Radio, Archive } from 'lucide-react';
import BingeStats from './BingeStats';
import SeasonalChart from './SeasonalChart';

const HYPE_COLORS = ['#6BCB77', '#4D96FF', '#FFD93D', '#FF922B', '#FF6B6B'];

export default function WatchHabitsTab({ bingeData, overviewStats, advancedStats }) {
  const { comfortRewatchPercent, rewatchMinutes, planningCount, planningEpisodes, planningHours,
    movieEquivalents, marathonDays, seasonalData } = overviewStats || {};
  const { hypeLag } = advancedStats || {};

  return (
    <div className="tab-content">
      {/* Row 1: Binge Stats + Seasonal Chart */}
      <section className="section texture-halftone">
        <div className="container relative z-1">
          <div className="grid-2" style={{ gap: '2rem' }}>
            <BingeStats bingeData={bingeData} />
            <SeasonalChart data={seasonalData} />
          </div>
        </div>
      </section>

      {/* Row 2: Mini stat cards */}
      <section className="section section-yellow texture-dots">
        <div className="container relative z-1">
          <div className="stat-mini-grid">
            {/* Hype Lag */}
            {hypeLag && hypeLag.avgLag !== null && (
              <div className="stat-mini stat-mini-blue">
                <div className="stat-mini-icon">
                  <Clock size={28} strokeWidth={2.5} />
                </div>
                <div className="stat-mini-value" style={{ color: '#4D96FF' }}>
                  {hypeLag.avgLag > 0 ? '+' : ''}{hypeLag.avgLag}
                </div>
                <div className="stat-mini-label">AVG HYPE LAG (YEARS)</div>
                <div className="stat-mini-sub" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  {hypeLag.avgLag <= 0 ? (
                    <>
                      <Sparkles size={14} strokeWidth={2.5} />
                      <span>Seasonal watcher — on the pulse!</span>
                    </>
                  ) : hypeLag.avgLag <= 2 ? (
                    <>
                      <Radio size={14} strokeWidth={2.5} />
                      <span>Mostly current — slight delay</span>
                    </>
                  ) : (
                    <>
                      <Archive size={14} strokeWidth={2.5} />
                      <span>Backlog archaeologist</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Comfort Rewatch */}
            <div className="stat-mini stat-mini-accent">
              <div className="stat-mini-icon">
                <RotateCcw size={28} strokeWidth={2.5} />
              </div>
              <div className="stat-mini-value" style={{ color: 'var(--neo-accent)' }}>
                {comfortRewatchPercent || 0}%
              </div>
              <div className="stat-mini-label">COMFORT REWATCH INDEX</div>
              <div className="stat-mini-sub">
                {rewatchMinutes > 0 ? `~${rewatchMinutes}h rewatched` : 'No rewatches detected'}
              </div>
            </div>

            {/* Unfinished Business */}
            <div className="stat-mini stat-mini-secondary">
              <div className="stat-mini-icon">
                <ClipboardList size={28} strokeWidth={2.5} />
              </div>
              <div className="stat-mini-value" style={{ color: '#FF922B' }}>
                {planningCount || 0}
              </div>
              <div className="stat-mini-label">PLANNING BACKLOG</div>
              <div className="stat-mini-sub">
                {planningEpisodes} eps · ~{planningHours}h to clear
              </div>
            </div>

            {/* One Piece Effect */}
            <div className="stat-mini stat-mini-green">
              <div className="stat-mini-icon">
                <Film size={28} strokeWidth={2.5} />
              </div>
              <div className="stat-mini-value" style={{ color: '#6BCB77' }}>
                {movieEquivalents || 0}
              </div>
              <div className="stat-mini-label">MOVIE EQUIVALENTS</div>
              <div className="stat-mini-sub">
                {marathonDays} days of nonstop anime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Row 3: Hype Lag Distribution */}
      {hypeLag && hypeLag.distribution?.length > 0 && (
        <section className="section texture-grid">
          <div className="container relative z-1">
            <div className="neo-card">
              <div className="neo-card-header neo-card-header-muted">
                <div
                  className="flex-center"
                  style={{ width: 36, height: 36, border: '3px solid #000', background: 'var(--neo-white)' }}
                >
                  <CalendarDays size={20} strokeWidth={3} />
                </div>
                <h3>HYPE LAG BREAKDOWN</h3>
                <span
                  className="neo-badge neo-badge-pill neo-badge-secondary"
                  style={{ marginLeft: 'auto', fontSize: '0.7rem' }}
                >
                  {hypeLag.count} TITLES TRACKED
                </span>
              </div>
              <div className="neo-card-body">
                <p style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  How soon after release do you pick up anime?
                </p>
                <div className="hype-bar-track">
                  {hypeLag.distribution.map((d, i) => {
                    const total = hypeLag.distribution.reduce((s, x) => s + x.count, 0);
                    const pct = total > 0 ? (d.count / total) * 100 : 0;
                    return pct > 0 ? (
                      <div
                        key={d.label}
                        className="hype-bar-seg"
                        style={{ flex: pct, background: HYPE_COLORS[i % HYPE_COLORS.length] }}
                        title={`${d.label}: ${d.count}`}
                      >
                        {pct > 8 && `${d.label}`}
                      </div>
                    ) : null;
                  })}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem', justifyContent: 'center' }}>
                  {hypeLag.distribution.map((d, i) => (
                    <span
                      key={d.label}
                      className="neo-badge"
                      style={{ background: HYPE_COLORS[i % HYPE_COLORS.length], fontSize: '0.65rem' }}
                    >
                      {d.label}: {d.count}
                    </span>
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
