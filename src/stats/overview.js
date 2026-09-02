/**
 * Compute overview / summary statistics from raw list data and built-in stats.
 */
export function calculateOverviewStats(userStats, allEntries) {
  const anime = userStats?.statistics?.anime;
  if (!anime) {
    return null;
  }

  const totalAnime = anime.count || 0;
  const totalEpisodes = anime.episodesWatched || 0;
  const minutesWatched = anime.minutesWatched || 0;
  const hoursWatched = Math.round(minutesWatched / 60);
  const daysWatched = Math.round((minutesWatched / 60 / 24) * 10) / 10;
  const meanScore = anime.meanScore || 0;
  const standardDeviation = anime.standardDeviation || 0;

  // Calculate drop rate from statuses
  const statuses = anime.statuses || [];
  const droppedCount = statuses.find((s) => s.status === 'DROPPED')?.count || 0;
  const completedCount = statuses.find((s) => s.status === 'COMPLETED')?.count || 0;
  const totalStarted = completedCount + droppedCount;
  const dropRate = totalStarted > 0 ? Math.round((droppedCount / totalStarted) * 1000) / 10 : 0;

  // Rewatch stats from entries
  const rewatched = allEntries.filter((e) => e.repeat > 0);
  const totalRewatches = rewatched.reduce((sum, e) => sum + e.repeat, 0);
  const mostRewatched = [...rewatched]
    .sort((a, b) => b.repeat - a.repeat)
    .slice(0, 5)
    .map((e) => ({
      title: e.media.title.romaji || e.media.title.english || 'Unknown',
      repeat: e.repeat,
      coverImage: e.media.coverImage?.medium,
    }));

  // Seasonal patterns (what month does the user start watching new shows)
  const monthCounts = new Array(12).fill(0);
  allEntries.forEach((e) => {
    if (e.startedAt?.month) {
      monthCounts[e.startedAt.month - 1]++;
    }
  });
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const seasonalData = monthNames.map((month, i) => ({
    month,
    count: monthCounts[i],
  }));

  // --- NEW: Studio Loyalty ---
  const studios = anime.studios || [];
  const topStudio = studios.length > 0 ? studios.sort((a, b) => b.count - a.count)[0] : null;
  const studioLoyalty = topStudio && totalAnime > 0
    ? {
        name: topStudio.studio.name,
        count: topStudio.count,
        percent: Math.round((topStudio.count / totalAnime) * 1000) / 10,
      }
    : null;

  // --- NEW: Comfort Rewatch Index ---
  // Estimate rewatch minutes: for each repeat, assume re-watching total episodes
  let rewatchMinutes = 0;
  rewatched.forEach((e) => {
    const epMinutes = e.media.episodes ? (e.media.episodes * 24) : 0; // ~24 min per ep
    rewatchMinutes += epMinutes * e.repeat;
  });
  const comfortRewatchPercent = minutesWatched > 0
    ? Math.round((rewatchMinutes / minutesWatched) * 1000) / 10
    : 0;

  // --- NEW: Unfinished Business ---
  const planning = allEntries.filter((e) => e.status === 'PLANNING');
  const planningEpisodes = planning.reduce((sum, e) => sum + (e.media.episodes || 12), 0);
  const planningHours = Math.round((planningEpisodes * 24) / 60); // ~24 min per ep

  // --- NEW: One Piece Effect ---
  const movieEquivalents = Math.round(totalEpisodes / 6); // ~6 episodes = 1 movie (~2hrs)
  const marathonDays = daysWatched;

  return {
    totalAnime,
    totalEpisodes,
    hoursWatched,
    daysWatched,
    meanScore,
    standardDeviation,
    dropRate,
    droppedCount,
    completedCount,
    totalRewatches,
    mostRewatched,
    seasonalData,
    studioLoyalty,
    comfortRewatchPercent,
    rewatchMinutes: Math.round(rewatchMinutes / 60), // in hours
    planningCount: planning.length,
    planningEpisodes,
    planningHours,
    movieEquivalents,
    marathonDays,
  };
}
