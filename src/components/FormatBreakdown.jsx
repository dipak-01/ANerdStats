import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Film } from 'lucide-react';

const FORMAT_COLORS = {
  TV: '#FF6B6B',
  TV_SHORT: '#FF922B',
  MOVIE: '#FFD93D',
  SPECIAL: '#C4B5FD',
  OVA: '#6BCB77',
  ONA: '#4D96FF',
  MUSIC: '#FF6B9D',
};

const FORMAT_LABELS = {
  TV: 'TV',
  TV_SHORT: 'TV Short',
  MOVIE: 'Movie',
  SPECIAL: 'Special',
  OVA: 'OVA',
  ONA: 'ONA',
  MUSIC: 'Music',
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

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, payload }) {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (payload.count < 2) return null;

  return (
    <text
      x={x}
      y={y}
      fill="#000"
      fontFamily="Space Grotesk, sans-serif"
      fontWeight="900"
      fontSize="11"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {payload.label}
    </text>
  );
}

export default function FormatBreakdown({ formats }) {
  if (!formats?.length) return null;

  const data = formats
    .map((f) => ({
      name: f.format,
      label: FORMAT_LABELS[f.format] || f.format,
      count: f.count,
      color: FORMAT_COLORS[f.format] || '#A8E6CF',
    }))
    .sort((a, b) => b.count - a.count);

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
          <Film size={20} strokeWidth={3} />
        </div>
        <h3>FORMAT</h3>
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
                label={<CustomLabel />}
              >
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center',
            marginTop: '1rem',
            borderTop: 'var(--border-thin)',
            paddingTop: '1rem',
          }}
        >
          {data.map((d) => (
            <span
              key={d.name}
              className="neo-badge"
              style={{
                background: d.color,
                fontSize: '0.65rem',
              }}
            >
              {d.label}: {d.count}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
