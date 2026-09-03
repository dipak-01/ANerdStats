import ScoreDistribution from './ScoreDistribution';
import GenreChart from './GenreChart';
import StatGuide from './StatGuide';

const OVERVIEW_GUIDE = [
  {
    name: 'Score Distribution',
    tag: 'RATINGS',
    what: 'A complete frequency histogram of all scores (1–10) you have assigned to anime on your AniList list.',
    how: 'Shows whether your scores cluster around 7–8 (the classic community hump) or if you utilize the full spectrum from 1 to 10.',
  },
  {
    name: 'Top Genre Breakdown',
    tag: 'PREFERENCES',
    what: 'Ranks your most-watched genres by total count, paired with your personal mean rating for each category.',
    how: 'Helps you distinguish between comfort genres you watch casually in bulk vs genres where you maintain high artistic expectations.',
  },
  {
    name: 'Overview Summary Cards',
    tag: 'CORE STATS',
    what: 'High-level metrics: total anime, episodes, hours watched, mean score with standard deviation (±σ), and drop rate.',
    how: 'Standard deviation (σ) measures score volatility — high σ means you give both 2s and 10s; drop rate reflects how quickly you abandon shows you dislike.',
  },
];

export default function OverviewTab({ anime, allEntries }) {
  if (!anime) return null;

  return (
    <div className="tab-content">
      {/* Stat Explainer Guide */}
      <StatGuide title="OVERVIEW GUIDE: HOW TO READ THIS PAGE" items={OVERVIEW_GUIDE} />

      {/* Score Distribution + Genre */}
      <section className="section texture-dots">
        <div className="container relative z-1">
          <div className="grid-2" style={{ gap: '2rem' }}>
            <ScoreDistribution entries={allEntries} />
            <GenreChart genres={anime.genres} />
          </div>
        </div>
      </section>
    </div>
  );
}
