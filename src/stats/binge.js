/**
 * Calculate binge-watching statistics from raw list entries.
 */
export function calculateBingeStats(allEntries) {
  const completed = allEntries.filter(
    (e) =>
      e.status === 'COMPLETED' &&
      e.startedAt?.year &&
      e.completedAt?.year &&
      e.startedAt.month &&
      e.completedAt.month &&
      e.startedAt.day &&
      e.completedAt.day
  );

  if (completed.length === 0) {
    return {
      avgDays: null,
      fastestBinges: [],
      longestGaps: [],
      totalWithDates: 0,
    };
  }

  const daysToComplete = completed
    .map((e) => {
      const start = new Date(e.startedAt.year, e.startedAt.month - 1, e.startedAt.day);
      const end = new Date(e.completedAt.year, e.completedAt.month - 1, e.completedAt.day);
      const days = Math.round((end - start) / (1000 * 60 * 60 * 24));
      return {
        title: e.media.title.romaji || e.media.title.english || 'Unknown',
        days,
        episodes: e.media.episodes || 0,
        coverImage: e.media.coverImage?.medium,
      };
    })
    .filter((x) => x.days >= 0);

  if (daysToComplete.length === 0) {
    return { avgDays: null, fastestBinges: [], longestGaps: [], totalWithDates: 0 };
  }

  const avgDays = daysToComplete.reduce((sum, x) => sum + x.days, 0) / daysToComplete.length;

  // Fastest binges (completed the quickest, with at least some episodes)
  const fastestBinges = [...daysToComplete]
    .filter((x) => x.episodes > 1)
    .sort((a, b) => a.days - b.days || b.episodes - a.episodes)
    .slice(0, 5);

  // Longest gaps (took the most days to finish)
  const longestGaps = [...daysToComplete]
    .sort((a, b) => b.days - a.days)
    .slice(0, 5);

  return {
    avgDays: Math.round(avgDays * 10) / 10,
    fastestBinges,
    longestGaps,
    totalWithDates: daysToComplete.length,
  };
}
