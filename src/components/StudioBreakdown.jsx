import { Building2 } from 'lucide-react';

const COLORS = ['#FF6B6B', '#FFD93D', '#C4B5FD', '#6BCB77', '#4D96FF', '#FF922B', '#FF6B9D', '#A8E6CF'];

export default function StudioBreakdown({ studios }) {
  if (!studios?.length) return null;

  const data = studios.slice(0, 12);
  const maxCount = Math.max(...data.map((s) => s.count));

  return (
    <div className="neo-card">
      <div className="neo-card-header neo-card-header-muted">
        <div
          className="flex-center"
          style={{
            width: 36,
            height: 36,
            border: '3px solid #000',
            background: 'var(--neo-white)',
          }}
        >
          <Building2 size={20} strokeWidth={3} />
        </div>
        <h3>TOP STUDIOS</h3>
      </div>
      <div className="neo-card-body" style={{ padding: '0' }}>
        {data.map((studio, i) => {
          const pct = (studio.count / maxCount) * 100;
          return (
            <div key={studio.studio.name} className="rank-item">
              <span className="rank-number" style={{ color: COLORS[i % COLORS.length] }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div style={{ flex: 1 }}>
                <div className="rank-title">{studio.studio.name}</div>
                <div className="neo-bar-bg" style={{ marginTop: '0.25rem' }}>
                  <div
                    className="neo-bar-fill"
                    style={{
                      width: `${pct}%`,
                      background: COLORS[i % COLORS.length],
                    }}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'right', minWidth: '60px' }}>
                <div className="rank-value">{studio.count}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--neo-accent)' }}>
                  ★ {studio.meanScore}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
