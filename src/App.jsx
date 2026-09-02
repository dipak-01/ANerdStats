import { useState, useCallback } from 'react';
import './index.css';
import { queryAniList } from './api/client';
import { USER_STATS_QUERY, USER_LIST_QUERY } from './api/queries';
import { calculateBingeStats } from './stats/binge';
import { calculateTasteCorrelation } from './stats/taste';
import { calculateOverviewStats } from './stats/overview';
import SearchHero from './components/SearchHero';
import Dashboard from './components/Dashboard';

export default function App() {
  const [state, setState] = useState('idle'); // idle | loading | dashboard | error
  const [userStats, setUserStats] = useState(null);
  const [allEntries, setAllEntries] = useState([]);
  const [overviewStats, setOverviewStats] = useState(null);
  const [bingeData, setBingeData] = useState(null);
  const [tasteData, setTasteData] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = useCallback(async (username) => {
    setState('loading');
    setError('');

    try {
      // Fetch both queries in parallel
      const [statsResult, listResult] = await Promise.all([
        queryAniList(USER_STATS_QUERY, { name: username }),
        queryAniList(USER_LIST_QUERY, { userName: username }),
      ]);

      if (!statsResult?.User) {
        throw new Error('User not found. Check the username and try again.');
      }

      const user = statsResult.User;

      // Flatten all entries from all lists
      const entries = (listResult?.MediaListCollection?.lists || [])
        .flatMap((list) => list.entries || []);

      setUserStats(user);
      setAllEntries(entries);

      // Compute derived stats
      const overview = calculateOverviewStats(user, entries);
      const binge = calculateBingeStats(entries);
      const taste = calculateTasteCorrelation(entries);

      setOverviewStats(overview);
      setBingeData(binge);
      setTasteData(taste);
      setState('dashboard');
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setState('error');
    }
  }, []);

  const handleBack = useCallback(() => {
    setState('idle');
    setUserStats(null);
    setAllEntries([]);
    setOverviewStats(null);
    setBingeData(null);
    setTasteData(null);
    setError('');
  }, []);

  // Loading state
  if (state === 'loading') {
    return (
      <div className="loading-container texture-halftone">
        <div className="loading-spinner" />
        <div className="loading-text">CRUNCHING YOUR STATS...</div>
        <p style={{ fontWeight: 700, fontSize: '0.85rem', maxWidth: '400px', textAlign: 'center' }}>
          Fetching data from AniList and computing analytics. This may take a moment for large lists.
        </p>
      </div>
    );
  }

  // Error state
  if (state === 'error') {
    return (
      <div>
        <SearchHero onSearch={handleSearch} isLoading={false} />
        <div className="error-container">
          <div className="error-box">
            <h3 className="error-title">⚠ SOMETHING WENT WRONG</h3>
            <p className="error-message">{error}</p>
            <button className="neo-btn neo-btn-secondary" onClick={handleBack}>
              TRY AGAIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard state
  if (state === 'dashboard' && userStats) {
    return (
      <Dashboard
        userStats={userStats}
        allEntries={allEntries}
        overviewStats={overviewStats}
        bingeData={bingeData}
        tasteData={tasteData}
        onBack={handleBack}
      />
    );
  }

  // Idle state (search hero)
  return <SearchHero onSearch={handleSearch} isLoading={false} />;
}
