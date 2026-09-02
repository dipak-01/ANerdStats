import { Tag } from 'lucide-react';
import {
  Treemap, ResponsiveContainer, Tooltip,
} from 'recharts';

const COLORS = ['#FF6B6B', '#FFD93D', '#C4B5FD', '#6BCB77', '#4D96FF', '#FF922B', '#FF6B9D', '#A8E6CF'];

function CustomContent({ x, y, width, height, name, count, index }) {
  if (width < 30 || height < 20) return null;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={COLORS[index % COLORS.length]}
        stroke="#000"
        strokeWidth={3}
      />
      {width > 60 && height > 35 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 6}
            textAnchor="middle"
            fill="#000"
            fontFamily="Space Grotesk, sans-serif"
            fontWeight="900"
            fontSize={Math.min(12, width / 8)}
            style={{ textTransform: 'uppercase' }}
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 12}
            textAnchor="middle"
            fill="#000"
            fontFamily="Space Grotesk, sans-serif"
            fontWeight="700"
            fontSize={10}
          >
            {count}
          </text>
        </>
      )}
    </g>
  );
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="neo-tooltip">
      <div className="neo-tooltip-label">{d.name}</div>
      <div className="neo-tooltip-value">{d.count} titles · ★ {d.meanScore}</div>
    </div>
  );
}

export default function TagCloud({ tags }) {
  if (!tags?.length) return null;

  const data = tags.slice(0, 20).map((t, i) => ({
    name: t.tag.name,
    size: t.count,
    count: t.count,
    meanScore: t.meanScore,
    index: i,
  }));

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
          <Tag size={20} strokeWidth={3} />
        </div>
        <h3>TOP TAGS</h3>
      </div>
      <div className="neo-card-body">
        <div className="chart-container" style={{ height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={data}
              dataKey="size"
              nameKey="name"
              content={<CustomContent />}
              animationDuration={300}
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
