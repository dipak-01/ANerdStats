import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="neo-tooltip">
      <div className="neo-tooltip-label">{d.year}</div>
      <div className="neo-tooltip-value">Avg Score: {d.avgScore}</div>
      <div className="neo-tooltip-value">{d.count} titles</div>
    </div>
  );
}

export default function GradeInflation({ data }) {
  if (!data?.length || data.length < 2) return null;

  const firstAvg = data[0].avgScore;
  const lastAvg = data[data.length - 1].avgScore;
  const trend = lastAvg - firstAvg;
  const overallAvg = data.reduce((sum, d) => sum + d.avgScore, 0) / data.length;

  return (
    <div className="neo-card">
      <div className="neo-card-header neo-card-header-accent">
        <div
          className="flex-center"
          style={{ width: 36, height: 36, border: '3px solid #000', background: 'var(--neo-white)' }}
        >
          <TrendingUp size={20} strokeWidth={3} />
        </div>
        <h3>GRADE INFLATION</h3>
      </div>
      <div className="neo-card-body">
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span
            className="neo-badge"
            style={{
              background: trend > 0.3 ? '#6BCB77' : trend < -0.3 ? '#FF6B6B' : '#FFD93D',
              fontSize: '0.75rem',
              padding: '0.3rem 0.75rem',
              border: '2px solid #000',
            }}
          >
            {trend > 0.3 ? '📈 GETTING GENEROUS' : trend < -0.3 ? '📉 GETTING HARSHER' : '➡️ CONSISTENT'}
            {' · '}
            {trend > 0 ? '+' : ''}{trend.toFixed(2)} OVER TIME
          </span>
        </div>
        <div className="chart-container" style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="0" stroke="#000" strokeOpacity={0.1} />
              <XAxis
                dataKey="year"
                stroke="#000"
                strokeWidth={2}
                tick={{ fontWeight: 700, fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#000"
                strokeWidth={2}
                tick={{ fontWeight: 700 }}
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
              />
              <ReferenceLine y={overallAvg} stroke="#000" strokeDasharray="6 3" strokeWidth={2} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="avgScore"
                stroke="#FF6B6B"
                strokeWidth={3}
                dot={{ fill: '#FF6B6B', stroke: '#000', strokeWidth: 2, r: 4 }}
                activeDot={{ fill: '#FFD93D', stroke: '#000', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>
          DASHED LINE = YOUR OVERALL AVERAGE · X AXIS = YEAR YOU STARTED WATCHING
        </div>
      </div>
    </div>
  );
}
