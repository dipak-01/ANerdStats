import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Calendar } from 'lucide-react';

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

export default function YearTimeline({ releaseYears }) {
  if (!releaseYears?.length) return null;

  const data = [...releaseYears]
    .filter((y) => y.releaseYear > 0)
    .sort((a, b) => a.releaseYear - b.releaseYear)
    .map((y) => ({
      year: y.releaseYear,
      count: y.count,
      meanScore: y.meanScore,
    }));

  if (data.length === 0) return null;

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
          <Calendar size={20} strokeWidth={3} />
        </div>
        <h3>ANIME BY RELEASE YEAR</h3>
      </div>
      <div className="neo-card-body">
        <div className="chart-container" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="0" stroke="#000" strokeOpacity={0.1} />
              <XAxis
                dataKey="year"
                stroke="#000"
                strokeWidth={2}
                tick={{ fontWeight: 700, fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis stroke="#000" strokeWidth={2} tick={{ fontWeight: 700 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="stepAfter"
                dataKey="count"
                name="Count"
                stroke="#000"
                strokeWidth={3}
                fill="#FFD93D"
                fillOpacity={0.8}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
