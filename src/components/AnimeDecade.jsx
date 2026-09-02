import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Clock3 } from 'lucide-react';

const DECADE_COLORS = {
  '1970s': '#A8E6CF',
  '1980s': '#C4B5FD',
  '1990s': '#4D96FF',
  '2000s': '#FFD93D',
  '2010s': '#FF6B6B',
  '2020s': '#6BCB77',
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="neo-tooltip">
      <div className="neo-tooltip-label">{d.label}</div>
      <div className="neo-tooltip-value">{d.count} anime</div>
      {d.meanScore && <div className="neo-tooltip-value">★ {d.meanScore}</div>}
    </div>
  );
}

export default function AnimeDecade({ data }) {
  if (!data?.decades?.length) return null;

  return (
    <div className="neo-card">
      <div className="neo-card-header neo-card-header-muted">
        <div
          className="flex-center"
          style={{ width: 36, height: 36, border: '3px solid #000', background: 'var(--neo-white)' }}
        >
          <Clock3 size={20} strokeWidth={3} />
        </div>
        <h3>YOUR ANIME DECADE</h3>
        {data.dominantDecade && (
          <span
            className="neo-badge neo-badge-accent"
            style={{ marginLeft: 'auto', fontSize: '0.7rem', transform: 'rotate(2deg)' }}
          >
            {data.dominantDecade} KID
          </span>
        )}
      </div>
      <div className="neo-card-body">
        <div className="chart-container" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.decades} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="0" stroke="#000" strokeOpacity={0.1} vertical={false} />
              <XAxis dataKey="label" stroke="#000" strokeWidth={2} tick={{ fontWeight: 900, fontSize: 12 }} />
              <YAxis stroke="#000" strokeWidth={2} tick={{ fontWeight: 700 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" stroke="#000" strokeWidth={2} barSize={40}>
                {data.decades.map((d) => (
                  <Cell key={d.label} fill={DECADE_COLORS[d.label] || '#A8E6CF'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Mean score per decade */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem', borderTop: 'var(--border-thin)', paddingTop: '1rem' }}>
          {data.decades.filter((d) => d.meanScore).map((d) => (
            <span key={d.label} className="neo-badge" style={{ background: DECADE_COLORS[d.label] || '#A8E6CF', fontSize: '0.65rem' }}>
              {d.label}: ★ {d.meanScore}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
