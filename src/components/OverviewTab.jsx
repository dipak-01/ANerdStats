import ScoreDistribution from './ScoreDistribution';
import GenreChart from './GenreChart';

export default function OverviewTab({ anime, allEntries }) {
  if (!anime) return null;

  return (
    <div className="tab-content">
      {/* Score Distribution + Genre */}
      <section className="section section-yellow texture-dots">
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
