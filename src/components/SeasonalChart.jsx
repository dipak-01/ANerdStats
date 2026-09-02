import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { CalendarDays } from 'lucide-react';

const MONTH_COLORS = [
  '#4D96FF', '#4D96FF', '#6BCB77',  // Jan-Mar (Winter→Spring)
  '#6BCB77', '#6BCB77', '#FFD93D',  // Apr-Jun (Spring→Summer)
  '#FFD93D', '#FFD93D', '#FF922B',  // Jul-Sep (Summer→Fall)
  '#FF922B', '#FF922B', '#4D96FF',  // Oct-Dec (Fall→Winter)
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="neo-tooltip">
      <div className="neo-tooltip-label">{d.month}</div>
      <div className="neo-tooltip-value">{d.count} shows started</div>
    </div>
  );
}

export default function SeasonalChart({ data }) {
  if (!data?.length || data.every((d) => d.count === 0)) return null;

  const peakMonth = [...data].sort((a, b) => b.count - a.count)[0];

  return (
    <div className="neo-card">
      <div className="neo-card-header neo-card-header-secondary">
        <div
          className="flex-center"
          style={{ width: 36, height: 36, border: '3px solid #000', background: 'var(--neo-white)' }}
        >
          <CalendarDays size={20} strokeWidth={3} />
        </div>
        <h3>SEASONAL PATTERNS</h3>
      </div>
      <div className="neo-card-body">
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span className="neo-badge neo-badge-accent" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}>
            PEAK MONTH: {peakMonth.month} ({peakMonth.count} SHOWS)
          </span>
        </div>
        <div className="chart-container" style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="0" stroke="#000" strokeOpacity={0.1} vertical={false} />
              <XAxis dataKey="month" stroke="#000" strokeWidth={2} tick={{ fontWeight: 900, fontSize: 11 }} />
              <YAxis stroke="#000" strokeWidth={2} tick={{ fontWeight: 700 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" stroke="#000" strokeWidth={2} barSize={28}>
                {data.map((_, i) => (
                  <Cell key={i} fill={MONTH_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
