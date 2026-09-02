import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Eye, Gem, ThumbsDown } from 'lucide-react';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="neo-tooltip">
      <div className="neo-tooltip-label">{d.title}</div>
      <div className="neo-tooltip-value">Your Score: {d.userScore}/10</div>
      <div className="neo-tooltip-value">Global: {d.globalScore.toFixed(1)}/10</div>
    </div>
  );
}

const RATING_STYLE_BADGE = {
  'generous': { color: '#6BCB77', label: '💚 GENEROUS RATER' },
  'slightly generous': { color: '#FFD93D', label: '😊 SLIGHTLY GENEROUS' },
  'balanced': { color: '#4D96FF', label: '⚖️ BALANCED' },
  'slightly harsh': { color: '#FF922B', label: '😤 SLIGHTLY HARSH' },
  'harsh critic': { color: '#FF6B6B', label: '🔥 HARSH CRITIC' },
  'unknown': { color: '#C4B5FD', label: '❓ UNKNOWN' },
};

export default function TasteCorrelation({ tasteData }) {
  if (!tasteData || tasteData.totalScored === 0) return null;

  const style = RATING_STYLE_BADGE[tasteData.ratingStyle] || RATING_STYLE_BADGE.unknown;

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
          <Eye size={20} strokeWidth={3} />
        </div>
        <h3>TASTE VS. THE CROWD</h3>
      </div>
      <div className="neo-card-body">
        {/* Rating style badge */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span
            className="neo-badge"
            style={{
              background: style.color,
              fontSize: '1rem',
              padding: '0.5rem 1.25rem',
              boxShadow: 'var(--shadow-sm)',
              transform: 'rotate(-1deg)',
              display: 'inline-block',
            }}
          >
            {style.label}
          </span>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '0.75rem' }}>
            Avg diff: <strong style={{ color: tasteData.avgDiff > 0 ? '#6BCB77' : '#FF6B6B' }}>
              {tasteData.avgDiff > 0 ? '+' : ''}{tasteData.avgDiff}
            </strong> points · {tasteData.totalScored} scored titles
          </div>
        </div>

        {/* Scatter plot */}
        <div className="chart-container" style={{ height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="0" stroke="#000" strokeOpacity={0.1} />
              <XAxis
                dataKey="globalScore"
                name="Global"
                stroke="#000"
                strokeWidth={2}
                tick={{ fontWeight: 700, fontSize: 11 }}
                label={{ value: 'GLOBAL SCORE', position: 'bottom', fontWeight: 900, fontSize: 11, letterSpacing: '0.1em' }}
                domain={[1, 10]}
              />
              <YAxis
                dataKey="userScore"
                name="Yours"
                stroke="#000"
                strokeWidth={2}
                tick={{ fontWeight: 700, fontSize: 11 }}
                label={{ value: 'YOUR SCORE', angle: -90, position: 'insideLeft', fontWeight: 900, fontSize: 11, letterSpacing: '0.1em' }}
                domain={[1, 10]}
              />
              <ReferenceLine
                segment={[{ x: 1, y: 1 }, { x: 10, y: 10 }]}
                stroke="#000"
                strokeWidth={2}
                strokeDasharray="8 4"
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter
                data={tasteData.scatterData}
                fill="#FF6B6B"
                stroke="#000"
                strokeWidth={2}
                r={5}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '0.25rem' }}>
          DASHED LINE = PERFECT AGREEMENT · ABOVE = YOU SCORED HIGHER
        </div>

        {/* Hidden gems and overrated */}
        <div className="grid-2" style={{ marginTop: '1.5rem', gap: '1.5rem' }}>
          {/* Hidden Gems */}
          {tasteData.hiddenGems.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.85rem', letterSpacing: '0.15em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Gem size={18} strokeWidth={3} />
                YOUR HIDDEN GEMS
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {tasteData.hiddenGems.slice(0, 5).map((g, i) => (
                  <div key={i} className="taste-card">
                    {g.coverImage && (
                      <img src={g.coverImage} alt="" className="taste-card-cover" loading="lazy" />
                    )}
                    <div className="taste-card-info">
                      <div className="taste-card-title">{g.title}</div>
                      <div className="taste-card-scores">
                        <span>You: <strong>{g.yourScore}/10</strong></span>
                        <span>Global: <strong>{g.globalScore}%</strong></span>
                        <span style={{ color: '#6BCB77' }}>+{g.diff}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Overrated for you */}
          {tasteData.overratedForYou.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.85rem', letterSpacing: '0.15em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ThumbsDown size={18} strokeWidth={3} />
                OVERRATED FOR YOU
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {tasteData.overratedForYou.slice(0, 5).map((g, i) => (
                  <div key={i} className="taste-card">
                    {g.coverImage && (
                      <img src={g.coverImage} alt="" className="taste-card-cover" loading="lazy" />
                    )}
                    <div className="taste-card-info">
                      <div className="taste-card-title">{g.title}</div>
                      <div className="taste-card-scores">
                        <span>You: <strong>{g.yourScore}/10</strong></span>
                        <span>Global: <strong>{g.globalScore}%</strong></span>
                        <span style={{ color: '#FF6B6B' }}>{g.diff}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
