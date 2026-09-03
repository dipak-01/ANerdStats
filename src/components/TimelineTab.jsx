import YearTimeline from './YearTimeline';
import AnimeDecade from './AnimeDecade';

export default function TimelineTab({ releaseYears, decadeData, genreEvolution }) {
  return (
    <div className="tab-content">
      {/* Row 1: Year Timeline + Anime Decade */}
      <section className="section texture-halftone">
        <div className="container relative z-1">
          <div className="grid-2" style={{ gap: '2rem' }}>
            <YearTimeline releaseYears={releaseYears} />
            <AnimeDecade data={decadeData} />
          </div>
        </div>
      </section>

      {/* Row 2: Genre Evolution Timeline */}
      {genreEvolution && genreEvolution.length > 0 && (
        <section className="section section-yellow texture-dots">
          <div className="container relative z-1">
            <div className="neo-card">
              <div className="neo-card-header neo-card-header-accent">
                <div
                  className="flex-center"
                  style={{ width: 36, height: 36, border: '3px solid #000', background: 'var(--neo-white)' }}
                >
                  <span style={{ fontSize: '1.1rem' }}>🎭</span>
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
                      {genreEvolution.map((row) => (
                        <tr key={row.year}>
                          <td>
                            <span className="rank-number" style={{ fontSize: '1rem' }}>{row.year}</span>
                          </td>
                          <td>
                            <span className="neo-badge neo-badge-accent" style={{ fontSize: '0.7rem' }}>
                              {row.topGenre}
                            </span>
                          </td>
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
