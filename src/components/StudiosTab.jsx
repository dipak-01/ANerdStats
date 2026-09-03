import { Building2 } from 'lucide-react';
import StudioBreakdown from './StudioBreakdown';
import FormatBreakdown from './FormatBreakdown';
import StatusBreakdown from './StatusBreakdown';

export default function StudiosTab({ anime, overviewStats }) {
  if (!anime) return null;

  return (
    <div className="tab-content">
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
