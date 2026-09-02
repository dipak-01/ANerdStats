# Anime Stats for Nerds — Full Stats Catalog & API-Efficient Architecture

## Part 1: Full Stats Catalog

### 1.1 Built-in AniList Stats (from one `statistics.anime` query)

- Genre breakdown — % watched, count, mean score per genre
- Score distribution — histogram of user's rating scale
- Studio breakdown — most-watched studios + mean score per studio
- Staff breakdown — favorite directors/VAs by count and score
- Format breakdown — TV vs Movie vs OVA vs ONA
- Status breakdown — completed/watching/dropped/planning ratios (drop rate)
- Country of origin breakdown
- Stats by release year — count and mean score per year
- Tag-level stats — fine-grained tags (e.g. "Isekai," "Time Skip," "Tragedy") with relevance %
- Total time watched, total episodes, overall mean score, standard deviation

### 1.2 Derived Stats (computed from one `MediaListCollection` pull — no extra calls)

- **Binge patterns** — avg days-to-complete via `startedAt`/`completedAt`, fastest binges, longest gaps
- **Rewatch stats** — count and which series get rewatched most (`repeat` field)
- **Taste correlation** — user's score vs. global `averageScore` per title; surfaces hidden gems and overrated-for-you titles
- **Seasonal start patterns** — which month/season the user tends to start new shows
- **Score vs. popularity scatter** — mainstream-hit lover vs. hidden-gem hunter
- **Score Volatility** — std. dev. of scores; low = "everything's a 7" rater, high = polarized rater
- **Contrarian Score** — title(s) with biggest divergence from global average, either direction
- **Grade Inflation Over Time** — average score per year trending up/down (jaded vs. still-enthusiastic)
- **Popularity Bias Score** — correlation between a title's popularity rank and the user's own score
- **The "One Piece Effect"** — total episodes converted into real-world time equivalents (days watched, movie-length equivalents)
- **Comfort Rewatch Index** — hours spent rewatching vs. watching new content
- **Longest Watching Streak** — consecutive days with a logged episode (needs activity timestamps, see 1.4)
- **Unfinished Business** — total episodes sitting in "Planning," framed as hours of guilt
- **Studio Loyalty** — % of watched shows from single most-watched studio
- **Your Anime Decade** — dominant decade (90s/2000s/2010s) + mean score per decade
- **Genre Evolution Timeline** — dominant genre by year-started, shows taste drift over time
- **The Hype Lag** — avg. time between a title's release date and when the user started it

### 1.3 Stats Needing One Extra Call Per Title (batch, don't loop per-title — see Part 2)

- **Sequel/Franchise Completion Rate** — cross-reference `relations` (SEQUEL) against the user's list
- **Filler Tolerance Score** — for long-running shonen, completion % as proxy for filler tolerance (uses `episodes` already in list data — no extra call actually needed)

### 1.4 Stats Needing Extra Data Sources (heavier, use sparingly)

- **Longest Watching Streak** — needs `User.activities` (ListActivity) query, paginated
- **Watch Twin Finder** — cosine similarity of tag/genre vectors against other users — **requires a backend + your own aggregated database**, not a live cross-user API call
- **Taste Percentile** — "more into Isekai than 87% of users" — same as above, needs pre-aggregated global data, not computable live per request

### 1.5 Fun/Shareable Composite Stats (pure computation, no extra calls)

- **Anime Alignment Chart** — 2x2 plot: popularity (mainstream↔niche) vs. taste-vs-crowd (mainstream-score↔contrarian-score)
- **Drop Point Analysis** — for dropped shows, average % through the series where they quit (`progress / episodes`)

---

## Part 2: API-Call-Efficient Architecture

The core constraint: AniList allows roughly **90 requests/minute per IP**, and it's
shared across everyone hitting the app if calls go straight from the browser.
The goal is **1–2 calls per user session**, not one call per stat.

### 2.1 Golden rule: fetch once, compute many

Almost everything in 1.1–1.3 and 1.5 can be derived from just **two** GraphQL calls:

1. `User.statistics.anime` — one call, gives you all of Part 1.1 pre-aggregated by AniList itself (zero computation needed)
2. `MediaListCollection` — one call, gives you every entry with score/dates/media info, which covers all of 1.2, 1.3 (relations excluded), and 1.5

Never loop a per-title request for stats that are already inside the list entries
you pulled in call #2 (episodes, genres, averageScore, popularity are all already there).

### 2.2 Batch the one case that needs per-title calls (relations for sequels)

Don't call `Media(id: X) { relations }` once per title in a loop — that's the fastest way to blow the rate limit on a list of 300+ anime.

Instead, use a single **aliased batch query** that fetches relations for many IDs in one HTTP request:

```graphql
query {
  m0: Media(id: 101922) {
    id
    relations {
      edges {
        relationType
        node {
          id
          title {
            romaji
          }
          type
        }
      }
    }
  }
  m1: Media(id: 21) {
    id
    relations {
      edges {
        relationType
        node {
          id
          title {
            romaji
          }
          type
        }
      }
    }
  }
  m2: Media(id: 20958) {
    id
    relations {
      edges {
        relationType
        node {
          id
          title {
            romaji
          }
          type
        }
      }
    }
  }
}
```

Batch 25–50 IDs per request (AniList's GraphQL complexity limit will cap how many
you can safely include — test and tune the batch size). This turns "300 titles = 300 requests" into "300 titles = ~6–12 requests," and even that only needs to run for franchise-completion stats, not on every page load.

### 2.3 Cache aggressively (this matters more than clever queries)

- Cache the full response of both core queries **per user** for several hours (e.g. Redis or even just a Postgres table with a `fetched_at` timestamp)
- On repeat visits within the cache window, serve from your DB — zero AniList calls
- Add a manual "Refresh my stats" button instead of auto-refetching on every page load
- If multiple people view the same public profile, they all hit your cache, not AniList

### 2.4 Rate-limit-safe request wrapper

Wrap all AniList calls with retry + backoff so a 429 doesn't crash the request — just wait and retry:

```javascript
async function anilistRequest(query, variables, retries = 3) {
  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (res.status === 429 && retries > 0) {
    const retryAfter = parseInt(res.headers.get("retry-after") || "5", 10);
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
    return anilistRequest(query, variables, retries - 1);
  }

  return res.json();
}
```

### 2.5 Move calls server-side once you have real users

Doing calls directly from each user's browser means **your rate limit budget is
shared unpredictably** across everyone using the app at once. Routing all AniList
calls through your own backend lets you:

- Enforce a queue so you never exceed 90/min total across all users
- Cache once, serve many — one popular public profile view doesn't cost repeated AniList hits
- Only then build the Watch Twin / Taste Percentile features (1.4), since those need a database of many users' aggregated stats, which only your backend can build and query

### 2.6 Feature rollout order, by API cost

| Tier                                                 | Stats                               | API cost                                                        |
| ---------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------- |
| Tier 1 (MVP, browser-only OK)                        | All of 1.1, 1.2, 1.5                | 2 calls per user, ever (cache after)                            |
| Tier 2 (needs batching)                              | Sequel completion (1.3)             | ~6–12 batched calls, only computed on demand, cached after      |
| Tier 3 (needs backend + DB)                          | Longest streak (1.4, activity feed) | 1 paginated call per user, cached                               |
| Tier 4 (needs backend + aggregated DB of many users) | Watch Twin, Taste Percentile (1.4)  | Zero live AniList calls — computed against your own stored data |

Build Tier 1 first — it's the vast majority of the "mind blow" stats and costs almost nothing in API terms. Save Tier 4 for once you have enough users in your own database to make comparisons meaningful anyway.
