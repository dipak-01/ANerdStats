import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Layers } from 'lucide-react';

const COLORS = ['#FF6B6B', '#FFD93D', '#C4B5FD', '#6BCB77', '#4D96FF', '#FF922B', '#FF6B9D', '#A8E6CF'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="neo-tooltip">
      <div className="neo-tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="neo-tooltip-value" style={{ color: p.color }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
}

export default function GenreChart({ genres }) {
  if (!genres?.length) return null;

  const data = genres.slice(0, 15).map((g) => ({
    name: g.genre,
    count: g.count,
    meanScore: g.meanScore,
  }));

  return (
    <div className="neo-card">
      <div className="neo-card-header neo-card-header-accent">
        <div
          className="flex-center"
          style={{
            width: 36,
            height: 36,
            border: '3px solid #000',
            background: 'var(--neo-white)',
          }}
        >
          <Layers size={20} strokeWidth={3} />
        </div>
        <h3>GENRE BREAKDOWN</h3>
      </div>
      <div className="neo-card-body">
        <div className="chart-container" style={{ height: Math.max(300, data.length * 32) }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="0" stroke="#000" strokeOpacity={0.1} horizontal={false} />
              <XAxis type="number" stroke="#000" strokeWidth={2} tick={{ fontWeight: 700 }} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#000"
                strokeWidth={2}
                width={100}
                tick={{ fontWeight: 700, fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Count" stroke="#000" strokeWidth={2} barSize={20}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mean score list below chart */}
        <div style={{ marginTop: '1.5rem', borderTop: 'var(--border-default)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '0.5rem',
              paddingTop: '1rem',
            }}
          >
            {data.map((g, i) => (
              <div key={g.name} className="flex-between" style={{ padding: '0.25rem 0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>
                  <span style={{ color: COLORS[i % COLORS.length] }}>■</span> {g.name}
                </span>
                <span className="neo-badge neo-badge-pill" style={{ background: COLORS[i % COLORS.length], fontSize: '0.65rem' }}>
                  ★ {g.meanScore}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
