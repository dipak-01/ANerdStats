/**
 * Calculate taste correlation stats: user score vs. global average.
 */
export function calculateTasteCorrelation(allEntries) {
  const scored = allEntries.filter(
    (e) => e.score > 0 && e.media.averageScore > 0
  );

  if (scored.length === 0) {
    return {
      avgDiff: null,
      hiddenGems: [],
      overratedForYou: [],
      scatterData: [],
      totalScored: 0,
      ratingStyle: 'unknown',
    };
  }

  const diffs = scored.map((e) => {
    const userScoreNormalized = e.score * 10; // Normalize 1-10 to 10-100
    return {
      title: e.media.title.romaji || e.media.title.english || 'Unknown',
      yourScore: e.score,
      globalScore: e.media.averageScore,
      diff: userScoreNormalized - e.media.averageScore,
      popularity: e.media.popularity || 0,
      coverImage: e.media.coverImage?.medium,
    };
  });

  const avgDiff =
    Math.round((diffs.reduce((sum, d) => sum + d.diff, 0) / diffs.length) * 10) / 10;

  // Hidden gems: user loved it way more than the crowd, and crowd didn't rate it highly
  const hiddenGems = diffs
    .filter((d) => d.diff > 15 && d.globalScore < 70)
    .sort((a, b) => b.diff - a.diff)
    .slice(0, 10);

  // Overrated for you: crowd loves it, you didn't
  const overratedForYou = diffs
    .filter((d) => d.diff < -15 && d.globalScore > 70)
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 10);

  // Scatter data for chart
  const scatterData = diffs.map((d) => ({
    title: d.title,
    userScore: d.yourScore,
    globalScore: d.globalScore / 10, // Normalize to 1-10 for chart
    diff: d.diff,
    popularity: d.popularity,
  }));

  // Rating style classification
  let ratingStyle = 'balanced';
  if (avgDiff > 10) ratingStyle = 'generous';
  else if (avgDiff > 5) ratingStyle = 'slightly generous';
  else if (avgDiff < -10) ratingStyle = 'harsh critic';
  else if (avgDiff < -5) ratingStyle = 'slightly harsh';

  return {
    avgDiff,
    hiddenGems,
    overratedForYou,
    scatterData,
    totalScored: scored.length,
    ratingStyle,
  };
}
