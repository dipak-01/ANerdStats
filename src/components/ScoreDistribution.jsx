import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

const SCORE_COLORS = {
  1: '#FF6B6B',
  2: '#FF6B6B',
  3: '#FF922B',
  4: '#FF922B',
  5: '#FFD93D',
  6: '#FFD93D',
  7: '#6BCB77',
  8: '#6BCB77',
  9: '#4D96FF',
  10: '#C4B5FD',
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="neo-tooltip">
      <div className="neo-tooltip-label">Score {d.score}</div>
      <div className="neo-tooltip-value">{d.count} titles</div>
    </div>
  );
}

export default function ScoreDistribution({ entries }) {
  if (!entries?.length) return null;

  // Build histogram from 1 to 10
  const buckets = {};
  for (let i = 1; i <= 10; i++) buckets[i] = 0;

  entries.forEach((e) => {
    if (e.score > 0 && e.score <= 10) {
      buckets[Math.round(e.score)]++;
    }
  });

  const data = Object.entries(buckets).map(([score, count]) => ({
    score: Number(score),
    count,
  }));

  const totalScored = data.reduce((sum, d) => sum + d.count, 0);

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
          <BarChart3 size={20} strokeWidth={3} />
        </div>
        <h3>SCORE DISTRIBUTION</h3>
        <span className="neo-badge neo-badge-pill" style={{ background: 'var(--neo-white)', marginLeft: 'auto' }}>
          {totalScored} SCORED
        </span>
      </div>
      <div className="neo-card-body">
        <div className="chart-container" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="0" stroke="#000" strokeOpacity={0.1} vertical={false} />
              <XAxis
                dataKey="score"
                stroke="#000"
                strokeWidth={2}
                tick={{ fontWeight: 900, fontSize: 14 }}
              />
              <YAxis stroke="#000" strokeWidth={2} tick={{ fontWeight: 700 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" stroke="#000" strokeWidth={2} barSize={40}>
                {data.map((d) => (
                  <Cell key={d.score} fill={SCORE_COLORS[d.score]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
