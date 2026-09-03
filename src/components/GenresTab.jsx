import { Sparkles } from 'lucide-react';
import GenreChart from './GenreChart';
import TagCloud from './TagCloud';

export default function GenresTab({ anime, advancedStats }) {
  if (!anime) return null;

  return (
    <div className="tab-content">
      {/* Genre Chart */}
      <section className="section texture-halftone">
        <div className="container relative z-1">
          <GenreChart genres={anime.genres} />
        </div>
      </section>

      {/* Tag Cloud */}
      <section className="section section-violet texture-dots">
        <div className="container relative z-1">
          <TagCloud tags={anime.tags} />
        </div>
      </section>

      {/* Genre Evolution Timeline */}
      {advancedStats?.genreEvolution?.length > 0 && (
        <section className="section texture-grid">
          <div className="container relative z-1">
            <div className="neo-card">
              <div className="neo-card-header neo-card-header-accent">
                <div
                  className="flex-center"
                  style={{ width: 36, height: 36, border: '3px solid #000', background: 'var(--neo-white)' }}
                >
                  <Sparkles size={20} strokeWidth={3} />
                </div>
                <h3>GENRE EVOLUTION</h3>
              </div>
              <div className="neo-card-body">
                <p style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Your dominant genre each year you started watching
                </p>
                <div className="table-scroll">
                  <table className="neo-table">
                    <thead>
                      <tr>
                        <th>YEAR</th>
                        <th>TOP GENRE</th>
                        <th>COUNT</th>
                        <th>TOTAL SHOWS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {advancedStats.genreEvolution.map((row) => (
                        <tr key={row.year}>
                          <td><span className="rank-number" style={{ fontSize: '1rem' }}>{row.year}</span></td>
                          <td><span className="neo-badge neo-badge-accent" style={{ fontSize: '0.7rem' }}>{row.topGenre}</span></td>
                          <td>{row.topCount}</td>
                          <td>{row.totalShows}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
