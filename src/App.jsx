import { useState, useCallback, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import './index.css';
import { queryAniList } from './api/client';
import { USER_STATS_QUERY, USER_LIST_QUERY } from './api/queries';
import { calculateBingeStats } from './stats/binge';
import { calculateTasteCorrelation } from './stats/taste';
import { calculateOverviewStats } from './stats/overview';
import {
  calculateContrarianScore,
  calculateGradeInflation,
  calculatePopularityBias,
  calculateAnimeDecade,
  calculateGenreEvolution,
  calculateHypeLag,
  calculateDropPointAnalysis,
} from './stats/advanced';
import SearchHero from './components/SearchHero';
import Dashboard from './components/Dashboard';
import OverviewTab from './components/OverviewTab';
import GenresTab from './components/GenresTab';
import StudiosTab from './components/StudiosTab';
import WatchHabitsTab from './components/WatchHabitsTab';
import TasteProfileTab from './components/TasteProfileTab';
import TimelineTab from './components/TimelineTab';
import AnimeInfoPage from './components/AnimeInfoPage';

export default function App() {
  const [username, setUsername] = useState(() => localStorage.getItem('anerdstats_user') || null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // React Query: User stats (cached 30min)
  const { data: statsResult, isLoading: statsLoading } = useQuery({
    queryKey: ['userStats', username],
    queryFn: () => queryAniList(USER_STATS_QUERY, { name: username }),
    staleTime: 1000 * 60 * 30,
    enabled: !!username,
  });

  // React Query: User list data (cached 30min)
  const { data: listResult, isLoading: listLoading } = useQuery({
    queryKey: ['userList', username],
    queryFn: () => queryAniList(USER_LIST_QUERY, { userName: username }),
    staleTime: 1000 * 60 * 30,
    enabled: !!username,
  });

  const userStats = statsResult?.User || null;
  const anime = userStats?.statistics?.anime || null;
  const allEntries = useMemo(
    () => (listResult?.MediaListCollection?.lists || []).flatMap((list) => list.entries || []),
    [listResult]
  );

  // Compute all derived stats from cached data
  const overviewStats = useMemo(
    () => userStats && allEntries.length > 0 ? calculateOverviewStats(userStats, allEntries) : null,
    [userStats, allEntries]
  );
  const bingeData = useMemo(
    () => allEntries.length > 0 ? calculateBingeStats(allEntries) : null,
    [allEntries]
  );
  const tasteData = useMemo(
    () => allEntries.length > 0 ? calculateTasteCorrelation(allEntries) : null,
    [allEntries]
  );
  const advancedStats = useMemo(() => {
    if (allEntries.length === 0) return null;
    return {
      contrarian: calculateContrarianScore(allEntries),
      gradeInflation: calculateGradeInflation(allEntries),
      popularityBias: calculatePopularityBias(allEntries),
      decade: calculateAnimeDecade(allEntries),
      genreEvolution: calculateGenreEvolution(allEntries),
      hypeLag: calculateHypeLag(allEntries),
      dropPoint: calculateDropPointAnalysis(allEntries),
    };
  }, [allEntries]);

  const handleSearch = useCallback(async (name) => {
    setIsSearching(true);
    setError('');

    try {
      // Fetch via queryClient so data lands in React Query cache
      const [stats] = await Promise.all([
        queryClient.fetchQuery({
          queryKey: ['userStats', name],
          queryFn: () => queryAniList(USER_STATS_QUERY, { name }),
          staleTime: 1000 * 60 * 30,
        }),
        queryClient.fetchQuery({
          queryKey: ['userList', name],
          queryFn: () => queryAniList(USER_LIST_QUERY, { userName: name }),
          staleTime: 1000 * 60 * 30,
        }),
      ]);

      if (!stats?.User) {
        throw new Error('User not found. Check the username and try again.');
      }

      setUsername(name);
      localStorage.setItem('anerdstats_user', name);
      setIsSearching(false);
      navigate('/stats');
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setIsSearching(false);
    }
  }, [queryClient, navigate]);

  const handleBack = useCallback(() => {
    setUsername(null);
    localStorage.removeItem('anerdstats_user');
    setError('');
    navigate('/');
  }, [navigate]);

  const isLoadingData = isSearching || (!!username && (statsLoading || listLoading));

  // Global loading state
  if (isLoadingData) {
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

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <SearchHero onSearch={handleSearch} isLoading={isSearching} />
            {error && (
              <div className="error-container">
                <div className="error-box">
                  <h3 className="error-title">⚠ SOMETHING WENT WRONG</h3>
                  <p className="error-message">{error}</p>
                </div>
              </div>
            )}
          </div>
        }
      />

      {/* Individual Stats Section Pages */}
      <Route
        path="/stats"
        element={
          userStats ? (
            <Dashboard
              userStats={userStats}
              overviewStats={overviewStats}
              onBack={handleBack}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      >
        <Route index element={<OverviewTab anime={anime} allEntries={allEntries} />} />
        <Route path="overview" element={<Navigate to="/stats" replace />} />
        <Route path="genres" element={<GenresTab anime={anime} advancedStats={advancedStats} />} />
        <Route path="studios" element={<StudiosTab anime={anime} overviewStats={overviewStats} />} />
        <Route path="habits" element={<WatchHabitsTab bingeData={bingeData} overviewStats={overviewStats} advancedStats={advancedStats} />} />
        <Route path="taste" element={<TasteProfileTab tasteData={tasteData} advancedStats={advancedStats} />} />
        <Route path="timeline" element={<TimelineTab releaseYears={anime?.releaseYears} decadeData={advancedStats?.decade} genreEvolution={advancedStats?.genreEvolution} />} />
      </Route>

      {/* Dedicated Anime Info Page */}
      <Route
        path="/anime/:id"
        element={
          <AnimeInfoPage
            allEntries={allEntries}
            userStats={userStats}
          />
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
