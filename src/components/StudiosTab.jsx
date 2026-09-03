import { Building2 } from 'lucide-react';
import StudioBreakdown from './StudioBreakdown';
import FormatBreakdown from './FormatBreakdown';
import StatusBreakdown from './StatusBreakdown';
import StatGuide from './StatGuide';

const STUDIOS_GUIDE = [
  {
    name: 'Studio Rankings',
    tag: 'PRODUCTION',
    what: 'Animation studios ranked by your total watched titles alongside your personal mean rating for each production house.',
    how: 'Helps identify which animation studio consistently delivers your highest-rated shows versus studios you consume purely by volume.',
  },
  {
    name: 'Studio Loyalty Index',
    tag: 'LOYALTY',
    what: 'The percentage of your entire watched anime library created by your single most-watched animation studio.',
    how: 'A loyalty percentage above 15% indicates a dedicated studio devotee who actively follows a specific studio aesthetic or director.',
  },
  {
    name: 'Format Breakdown',
    tag: 'FORMATS',
    what: 'Proportion of TV broadcast series, theatrical movies, OVAs (direct-to-video), ONAs (streaming originals), and specials.',
    how: 'Reveals whether you prefer serialized multi-episode storytelling or standalone cinema-quality anime films.',
  },
  {
    name: 'List Status Distribution',
    tag: 'DISCIPLINE',
    what: 'The breakdown of all entries between Completed, Currently Watching, Dropped, and Planning.',
    how: 'A high completed percentage demonstrates strong follow-through; an oversized planning slice indicates an expanding backlog.',
  },
];

export default function StudiosTab({ anime, overviewStats }) {
  if (!anime) return null;

  return (
    <div className="tab-content">
      {/* Stat Explainer Guide */}
      <StatGuide title="STUDIOS & FORMATS GUIDE: HOW TO READ THIS PAGE" items={STUDIOS_GUIDE} />

      <section className="section texture-halftone">
        <div className="container relative z-1">
          <div className="grid-3" style={{ gap: '2rem' }}>
            <StudioBreakdown studios={anime.studios} />
            <FormatBreakdown formats={anime.formats} />
            <StatusBreakdown statuses={anime.statuses} />
          </div>

          {/* Studio Loyalty mini card */}
          {overviewStats?.studioLoyalty && (
            <div style={{ marginTop: '2.5rem' }}>
              <div className="stat-mini stat-mini-muted" style={{ maxWidth: '440px', margin: '0 auto' }}>
                <div className="stat-mini-icon">
                  <Building2 size={28} strokeWidth={2.5} />
                </div>
                <div className="stat-mini-value" style={{ color: 'var(--neo-muted)', fontSize: '1.4rem' }}>
                  {overviewStats.studioLoyalty.name}
                </div>
                <div className="stat-mini-label">MOST WATCHED STUDIO</div>
                <div className="stat-mini-sub">
                  <strong>{overviewStats.studioLoyalty.count} titles</strong> · {overviewStats.studioLoyalty.percent}% of your anime library
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
