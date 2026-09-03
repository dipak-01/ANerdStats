import { Flame, Clock, Zap } from 'lucide-react';
import AnimeLink from './AnimeLink';

export default function BingeStats({ bingeData }) {
  if (!bingeData || bingeData.avgDays === null) return null;

  return (
    <div className="neo-card">
      <div className="neo-card-header neo-card-header-accent">
        <div
          className="flex-center"
          style={{
            width: 36,
            height: 36,
            border: '3px solid #000',
            background: 'var(--neo-white)',
          }}
        >
          <Flame size={20} strokeWidth={3} />
        </div>
        <h3>BINGE STATS</h3>
        <span
          className="neo-badge neo-badge-pill neo-badge-secondary"
          style={{ marginLeft: 'auto', transform: 'rotate(2deg)' }}
        >
          {bingeData.totalWithDates} WITH DATES
        </span>
      </div>
      <div className="neo-card-body">
        {/* Summary stat */}
        <div
          style={{
            textAlign: 'center',
            padding: '1.5rem',
            border: 'var(--border-default)',
            background: 'var(--neo-bg)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            AVG DAYS TO COMPLETE
          </div>
          <div className="stat-value" style={{ color: 'var(--neo-accent)' }}>
            <Clock size={32} strokeWidth={3} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} />
            {bingeData.avgDays}
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '0.25rem' }}>days per series</div>
        </div>

        {/* Fastest binges */}
        {bingeData.fastestBinges.length > 0 && (
          <div>
            <h4 style={{ fontSize: '0.85rem', letterSpacing: '0.15em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} strokeWidth={3} />
              FASTEST BINGES
            </h4>
            <div className="table-scroll">
              <table className="neo-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>TITLE</th>
                    <th>DAYS</th>
                    <th>EPS</th>
                  </tr>
                </thead>
                <tbody>
                  {bingeData.fastestBinges.map((b, i) => (
                    <tr key={i}>
                      <td>
                        <span className="rank-number" style={{ fontSize: '1.1rem' }}>{i + 1}</span>
                      </td>
                      <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <AnimeLink id={b.id}>{b.title}</AnimeLink>
                      </td>
                      <td>
                        <span className="neo-badge neo-badge-accent" style={{ fontSize: '0.7rem' }}>
                          {b.days === 0 ? 'SAME DAY' : `${b.days}d`}
                        </span>
                      </td>
                      <td>{b.episodes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Longest gaps */}
        {bingeData.longestGaps.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{ fontSize: '0.85rem', letterSpacing: '0.15em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} strokeWidth={3} />
              LONGEST TO FINISH
            </h4>
            <div className="table-scroll">
              <table className="neo-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>TITLE</th>
                    <th>DAYS</th>
                    <th>EPS</th>
                  </tr>
                </thead>
                <tbody>
                  {bingeData.longestGaps.map((b, i) => (
                    <tr key={i}>
                      <td>
                        <span className="rank-number" style={{ fontSize: '1.1rem' }}>{i + 1}</span>
                      </td>
                      <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <AnimeLink id={b.id}>{b.title}</AnimeLink>
                      </td>
                      <td>
                        <span className="neo-badge neo-badge-secondary" style={{ fontSize: '0.7rem' }}>
                          {b.days}d
                        </span>
                      </td>
                      <td>{b.episodes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
