import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle } from 'lucide-react';

const STATUS_COLORS = {
  COMPLETED: '#6BCB77',
  WATCHING: '#4D96FF',
  PAUSED: '#FFD93D',
  DROPPED: '#FF6B6B',
  PLANNING: '#C4B5FD',
};

const STATUS_LABELS = {
  COMPLETED: 'Completed',
  WATCHING: 'Watching',
  PAUSED: 'Paused',
  DROPPED: 'Dropped',
  PLANNING: 'Planning',
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="neo-tooltip">
      <div className="neo-tooltip-label">{d.label}</div>
      <div className="neo-tooltip-value">{d.count} titles</div>
    </div>
  );
}

export default function StatusBreakdown({ statuses }) {
  if (!statuses?.length) return null;

  const data = statuses
    .map((s) => ({
      name: s.status,
      label: STATUS_LABELS[s.status] || s.status,
      count: s.count,
      color: STATUS_COLORS[s.status] || '#A8E6CF',
    }))
    .sort((a, b) => b.count - a.count);

  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="neo-card">
      <div className="neo-card-header neo-card-header-secondary">
        <div
          className="flex-center"
          style={{
            width: 36,
            height: 36,
            border: '3px solid #000',
            background: 'var(--neo-white)',
          }}
        >
          <CheckCircle size={20} strokeWidth={3} />
        </div>
        <h3>STATUS</h3>
      </div>
      <div className="neo-card-body">
        <div className="chart-container flex-center" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={40}
                stroke="#000"
                strokeWidth={3}
              >
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status bars */}
        <div style={{ borderTop: 'var(--border-thin)', paddingTop: '1rem' }}>
          {data.map((d) => {
            const pct = ((d.count / total) * 100).toFixed(1);
            return (
              <div key={d.name} style={{ marginBottom: '0.75rem' }}>
                <div className="flex-between mb-1">
                  <span style={{ fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {d.label}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>
                    {d.count} ({pct}%)
                  </span>
                </div>
                <div className="neo-bar-bg">
                  <div
                    className="neo-bar-fill"
                    style={{
                      width: `${pct}%`,
                      background: d.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
