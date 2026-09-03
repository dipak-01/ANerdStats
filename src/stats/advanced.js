/**
 * Advanced derived stats — all computed from existing list data, zero extra API calls.
 */

/**
 * Contrarian Score — titles with biggest divergence from global average.
 */
export function calculateContrarianScore(allEntries) {
  const scored = allEntries.filter((e) => e.score > 0 && e.media.averageScore > 0);
  if (scored.length === 0) return { mostOverscored: [], mostUnderscored: [] };

  const diffs = scored.map((e) => ({
    id: e.media.id,
    title: e.media.title.romaji || e.media.title.english || 'Unknown',
    yourScore: e.score,
    globalScore: e.media.averageScore,
    diff: e.score * 10 - e.media.averageScore,
    coverImage: e.media.coverImage?.medium,
  }));

  const mostOverscored = [...diffs].sort((a, b) => b.diff - a.diff).slice(0, 5);
  const mostUnderscored = [...diffs].sort((a, b) => a.diff - b.diff).slice(0, 5);

  return { mostOverscored, mostUnderscored };
}

/**
 * Grade Inflation Over Time — average user score grouped by year they started watching.
 */
export function calculateGradeInflation(allEntries) {
  const withYear = allEntries.filter((e) => e.score > 0 && e.startedAt?.year);

  if (withYear.length === 0) return [];

  const byYear = {};
  withYear.forEach((e) => {
    const y = e.startedAt.year;
    if (!byYear[y]) byYear[y] = { total: 0, count: 0 };
    byYear[y].total += e.score;
    byYear[y].count++;
  });

  return Object.entries(byYear)
    .map(([year, data]) => ({
      year: Number(year),
      avgScore: Math.round((data.total / data.count) * 100) / 100,
      count: data.count,
    }))
    .sort((a, b) => a.year - b.year);
}

/**
 * Popularity Bias Score — correlation between a title's popularity rank and user score.
 * Returns Pearson correlation coefficient: +1 = loves popular stuff, -1 = hipster, 0 = no bias.
 */
export function calculatePopularityBias(allEntries) {
  const scored = allEntries.filter((e) => e.score > 0 && e.media.popularity > 0);
  if (scored.length < 5) return { correlation: null, label: 'NOT ENOUGH DATA', count: scored.length };

  const n = scored.length;
  const pops = scored.map((e) => e.media.popularity);
  const scores = scored.map((e) => e.score);

  const meanPop = pops.reduce((a, b) => a + b, 0) / n;
  const meanScore = scores.reduce((a, b) => a + b, 0) / n;

  let num = 0, denPop = 0, denScore = 0;
  for (let i = 0; i < n; i++) {
    const dp = pops[i] - meanPop;
    const ds = scores[i] - meanScore;
    num += dp * ds;
    denPop += dp * dp;
    denScore += ds * ds;
  }

  const den = Math.sqrt(denPop * denScore);
  const correlation = den === 0 ? 0 : Math.round((num / den) * 1000) / 1000;

  let label = 'BALANCED';
  if (correlation > 0.3) label = 'MAINSTREAM LOVER';
  else if (correlation > 0.15) label = 'LEANS MAINSTREAM';
  else if (correlation < -0.3) label = 'HIDDEN GEM HUNTER';
  else if (correlation < -0.15) label = 'LEANS NICHE';

  return { correlation, label, count: n };
}

/**
 * Anime Decade — count and mean score grouped by decade (90s, 2000s, 2010s, 2020s).
 */
export function calculateAnimeDecade(allEntries) {
  const withYear = allEntries.filter((e) => e.media.seasonYear > 0);
  if (withYear.length === 0) return { decades: [], dominantDecade: null };

  const byDecade = {};
  withYear.forEach((e) => {
    const decade = Math.floor(e.media.seasonYear / 10) * 10;
    const label = `${decade}s`;
    if (!byDecade[label]) byDecade[label] = { count: 0, totalScore: 0, scoredCount: 0, decade };
    byDecade[label].count++;
    if (e.score > 0) {
      byDecade[label].totalScore += e.score;
      byDecade[label].scoredCount++;
    }
  });

  const decades = Object.entries(byDecade)
    .map(([label, data]) => ({
      label,
      decade: data.decade,
      count: data.count,
      meanScore: data.scoredCount > 0 ? Math.round((data.totalScore / data.scoredCount) * 100) / 100 : null,
    }))
    .sort((a, b) => a.decade - b.decade);

  const dominantDecade = [...decades].sort((a, b) => b.count - a.count)[0]?.label || null;

  return { decades, dominantDecade };
}

/**
 * Genre Evolution Timeline — dominant genre per year the user started a show.
 */
export function calculateGenreEvolution(allEntries) {
  const withYear = allEntries.filter((e) => e.startedAt?.year && e.media.genres?.length > 0);
  if (withYear.length === 0) return [];

  const byYear = {};
  withYear.forEach((e) => {
    const y = e.startedAt.year;
    if (!byYear[y]) byYear[y] = {};
    e.media.genres.forEach((g) => {
      byYear[y][g] = (byYear[y][g] || 0) + 1;
    });
  });

  return Object.entries(byYear)
    .map(([year, genres]) => {
      const sorted = Object.entries(genres).sort((a, b) => b[1] - a[1]);
      return {
        year: Number(year),
        topGenre: sorted[0]?.[0] || 'Unknown',
        topCount: sorted[0]?.[1] || 0,
        totalShows: Object.values(genres).reduce((a, b) => a + b, 0),
      };
    })
    .sort((a, b) => a.year - b.year);
}

/**
 * Hype Lag — avg time (years) between a title's release year and when the user started it.
 */
export function calculateHypeLag(allEntries) {
  const withBoth = allEntries.filter(
    (e) => e.startedAt?.year && e.media.seasonYear > 0
  );

  if (withBoth.length === 0) return { avgLag: null, count: 0, distribution: [] };

  const lags = withBoth.map((e) => ({
    title: e.media.title.romaji || e.media.title.english || 'Unknown',
    lag: e.startedAt.year - e.media.seasonYear,
    releaseYear: e.media.seasonYear,
    startYear: e.startedAt.year,
  }));

  const avgLag = Math.round((lags.reduce((sum, l) => sum + l.lag, 0) / lags.length) * 10) / 10;

  // Distribution: how many watched in same year, 1 year later, 2-3 years, 4-5 years, 5+ years
  const buckets = { 'Same year': 0, '1 year': 0, '2-3 years': 0, '4-5 years': 0, '5+ years': 0 };
  lags.forEach((l) => {
    if (l.lag <= 0) buckets['Same year']++;
    else if (l.lag === 1) buckets['1 year']++;
    else if (l.lag <= 3) buckets['2-3 years']++;
    else if (l.lag <= 5) buckets['4-5 years']++;
    else buckets['5+ years']++;
  });

  const distribution = Object.entries(buckets).map(([label, count]) => ({ label, count }));

  return { avgLag, count: lags.length, distribution };
}

/**
 * Drop Point Analysis — avg % through the series where user drops.
 */
export function calculateDropPointAnalysis(allEntries) {
  const dropped = allEntries.filter(
    (e) => e.status === 'DROPPED' && e.progress > 0 && e.media.episodes > 0
  );

  if (dropped.length === 0) return { avgDropPercent: null, drops: [], count: 0 };

  const drops = dropped.map((e) => ({
    id: e.media.id,
    title: e.media.title.romaji || e.media.title.english || 'Unknown',
    progress: e.progress,
    total: e.media.episodes,
    percent: Math.round((e.progress / e.media.episodes) * 100),
    coverImage: e.media.coverImage?.medium,
  }));

  const avgDropPercent = Math.round(drops.reduce((sum, d) => sum + d.percent, 0) / drops.length);

  // Distribution by drop point
  const buckets = { '0-25%': 0, '25-50%': 0, '50-75%': 0, '75-100%': 0 };
  drops.forEach((d) => {
    if (d.percent <= 25) buckets['0-25%']++;
    else if (d.percent <= 50) buckets['25-50%']++;
    else if (d.percent <= 75) buckets['50-75%']++;
    else buckets['75-100%']++;
  });

  const distribution = Object.entries(buckets).map(([label, count]) => ({ label, count }));

  return {
    avgDropPercent,
    drops: drops.sort((a, b) => a.percent - b.percent).slice(0, 5),
    count: dropped.length,
    distribution,
  };
}
