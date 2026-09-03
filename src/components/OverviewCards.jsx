import { Timer, Tv, Star as StarIcon, Hash, TrendingUp } from 'lucide-react';

export default function OverviewCards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      label: 'Total Anime',
      value: stats.totalAnime.toLocaleString(),
      sub: null,
      accent: 'stat-card-accent',
      icon: <Tv size={24} strokeWidth={3} />,
    },
    {
      label: 'Episodes',
      value: stats.totalEpisodes.toLocaleString(),
      sub: null,
      accent: 'stat-card-secondary',
      icon: <Hash size={24} strokeWidth={3} />,
    },
    {
      label: 'Hours Watched',
      value: stats.hoursWatched.toLocaleString(),
      sub: `${stats.daysWatched} days`,
      accent: 'stat-card-muted',
      icon: <Timer size={24} strokeWidth={3} />,
    },
    {
      label: 'Mean Score',
      value: stats.meanScore.toFixed(1),
      sub: `σ ${stats.standardDeviation.toFixed(1)}`,
      accent: 'stat-card-accent',
      icon: <StarIcon size={24} strokeWidth={3} />,
    },
    {
      label: 'Drop Rate',
      value: `${stats.dropRate}%`,
      sub: `${stats.droppedCount} dropped`,
      accent: 'stat-card-ink',
      icon: <TrendingUp size={24} strokeWidth={3} />,
    },
  ];

  return (
    <div className="grid-5">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className={`stat-card ${card.accent}`}
          style={{ transform: `rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)` }}
        >
          <div className="flex-between mb-2">
            <div
              className="flex-center"
              style={{
                width: 40,
                height: 40,
                border: '3px solid #000',
                background: 'var(--neo-bg)',
              }}
            >
              {card.icon}
            </div>
            {card.sub && (
              <span className="neo-badge neo-badge-pill neo-badge-secondary" style={{ fontSize: '0.65rem' }}>
                {card.sub}
              </span>
            )}
          </div>
          <div className="stat-value">{card.value}</div>
          <div className="stat-label">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
