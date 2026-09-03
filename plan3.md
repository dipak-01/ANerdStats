# Anime Stats App — Addendum: Info Pages, Linking & Caching

## 1. Anime Info Pages

### 1.1 Purpose

Turn any title referenced in a stat (top studio's shows, hidden gem, contrarian
score outlier, franchise entries, Wrapped cards, etc.) into a clickable page —
not just a static AniList clone, but a page with the user's own context layered
on top.

### 1.2 Route

`/anime/:id` — `id` comes from `media.id`, already present on every entry pulled
via `MediaListCollection`. No extra fetch needed to generate the link itself.

### 1.3 Page content

**Core info** (from a single `Media(id)` query):

- Title, synopsis, cover art, format, episode count, studio, genres/tags, release info

**User-context layer** (computed from data already fetched for the stats pages —
no extra API call):

- User's score vs. global average, with the delta ("+15 vs. global average")
- Where it falls in binge stats ("watched in 3 days" / "took 8 months")
- Franchise chain + completion status ("You've watched 2 of 4 entries in this series")
- Tag overlap with the user's top tags ("shares 6 of your top 10 tags")

### 1.4 Query

```graphql
query ($id: Int) {
  Media(id: $id) {
    id
    title {
      romaji
      english
    }
    description
    coverImage {
      large
    }
    format
    episodes
    genres
    tags {
      name
      rank
    }
    studios {
      nodes {
        name
      }
    }
    seasonYear
    averageScore
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

This is a single, cheap, per-title call — not part of the batching problem
(that only applies to bulk franchise-completion lookups across an entire list
at once). Safe to call live on page visit.

## 2. Linking Anime Mentions

Wire every place a title is displayed (stat cards, Wrapped slides, franchise
lists, hidden-gems list, etc.) to route to the info page using the `id` already
present in the data:

```jsx
<Link to={`/anime/${entry.media.id}`}>{entry.media.title.romaji}</Link>
```

No data-fetching change required — this is UI/routing wiring only.

## 3. Caching — Two Distinct Layers

### 3.1 Client-side (in-session) cache

**Problem it solves:** avoid refetching AniList every time the user navigates
between pages within one visit (stats → anime info → back to stats).

**Approach:** React Query or SWR — cache by query key, dedupe concurrent
requests, control refetch via `staleTime`.

```javascript
// User's aggregate stats — one query, reused across all stat pages
const { data: userStats } = useQuery({
  queryKey: ["userStats", username],
  queryFn: () => fetchUserStats(username),
  staleTime: 1000 * 60 * 30, // 30 min
});

// Full list data — reused across derived-stat pages
const { data: listData } = useQuery({
  queryKey: ["userList", username],
  queryFn: () => fetchUserList(username),
  staleTime: 1000 * 60 * 30,
});

// Per-title info page — cached per id, long staleTime since metadata rarely changes
const { data: animeInfo } = useQuery({
  queryKey: ["anime", animeId],
  queryFn: () => fetchAnimeInfo(animeId),
  staleTime: 1000 * 60 * 60 * 24, // 24 hr
});
```

Scope: lasts only for the active session/tab. Resets on hard refresh unless
combined with layer 2.

### 3.2 Server-side (cross-session, cross-user) cache

**Problem it solves:** protects the AniList rate limit budget across time and
across different users — this is the layer that matters once there's real
traffic.

**Approach:** backend stores fetched data in a DB (or Redis) with a
`fetched_at` timestamp; serves cached data within the TTL window instead of
calling AniList again. A second user viewing the same public profile, or the
same title page, hits your cache — not AniList.

**Suggested TTLs by data type:**

| Data type                                 | Changes how often                                 | Suggested TTL                         |
| ----------------------------------------- | ------------------------------------------------- | ------------------------------------- |
| User aggregate stats (`statistics.anime`) | Whenever they log an episode                      | 1–6 hours, or manual "Refresh" button |
| Full list data (`MediaListCollection`)    | Same as above                                     | 1–6 hours                             |
| Anime info (`Media` metadata)             | Rarely (title/synopsis/studio essentially static) | 24 hours – 7 days                     |
| Franchise relations                       | Effectively static                                | 7+ days                               |

**Simple schema (Postgres example):**

```sql
CREATE TABLE cached_user_stats (
  username TEXT PRIMARY KEY,
  stats_json JSONB NOT NULL,
  list_json JSONB NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE cached_anime_info (
  anime_id INTEGER PRIMARY KEY,
  info_json JSONB NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL
);
```

**Fetch logic (pseudocode):**

```javascript
async function getUserStats(username) {
  const cached = await db.cached_user_stats.findOne({ username });
  const isStale = !cached || Date.now() - cached.fetched_at > CACHE_TTL_MS;

  if (!isStale) return cached.stats_json;

  const fresh = await anilistRequest(userStatsQuery, { username });
  await db.cached_user_stats.upsert({
    username,
    stats_json: fresh,
    fetched_at: new Date(),
  });
  return fresh;
}
```

### 3.3 Why both layers matter

- Client-side cache: smooth navigation within a single visit, zero perceived lag
- Server-side cache: protects the shared AniList rate limit across all users and
  visits over time — without it, popular public profiles or high traffic could
  exceed AniList's ~90 req/min limit even with client-side caching in place,
  since that cache resets per session/user

## 4. Rollout Order

1. Wire up `/anime/:id` links using existing `media.id` — no fetching change
2. Build the anime info page with core info + user-context layer
3. Add React Query/SWR client-side caching for stats + list + anime-info queries
4. Add backend server-side cache (DB table + TTL logic) once concurrent users are expected
