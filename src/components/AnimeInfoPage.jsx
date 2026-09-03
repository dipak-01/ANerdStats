import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft, Star, Clock, Film, Calendar, Users, Tag, Tv, ExternalLink,
  Check, X, BookmarkX,
} from 'lucide-react';
import { queryAniList } from '../api/client';
import { ANIME_INFO_QUERY } from '../api/queries';

const FORMAT_LABELS = {
  TV: 'TV Series',
  TV_SHORT: 'TV Short',
  MOVIE: 'Movie',
  SPECIAL: 'Special',
  OVA: 'OVA',
  ONA: 'ONA',
  MUSIC: 'Music',
  MANGA: 'Manga',
  NOVEL: 'Light Novel',
  ONE_SHOT: 'One Shot',
};

const STATUS_LABELS = {
  FINISHED: 'Finished',
  RELEASING: 'Airing',
  NOT_YET_RELEASED: 'Upcoming',
  CANCELLED: 'Cancelled',
  HIATUS: 'Hiatus',
};

const RELATION_LABELS = {
  PREQUEL: 'Prequel',
  SEQUEL: 'Sequel',
  SIDE_STORY: 'Side Story',
  PARENT: 'Parent',
  SPIN_OFF: 'Spin-Off',
  ALTERNATIVE: 'Alternative',
  SUMMARY: 'Summary',
  CHARACTER: 'Character',
  COMPILATION: 'Compilation',
  CONTAINS: 'Contains',
  OTHER: 'Other',
};

const RELATION_ORDER = ['PREQUEL', 'SEQUEL', 'PARENT', 'SIDE_STORY', 'SPIN_OFF', 'ALTERNATIVE', 'SUMMARY', 'CHARACTER', 'COMPILATION', 'CONTAINS', 'OTHER'];

/**
 * Strip basic HTML tags from AniList descriptions.
 */
function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Compute user-context for this anime from already-fetched list data.
 */
function computeUserContext(animeId, allEntries, userStats) {
  if (!allEntries?.length) return null;

  const entry = allEntries.find((e) => e.media?.id === animeId);
  if (!entry) return { onList: false };

  const result = {
    onList: true,
    status: entry.status,
    score: entry.score,
    progress: entry.progress,
    repeat: entry.repeat,
  };

  // Score vs global
  if (entry.score > 0 && entry.media?.averageScore > 0) {
    const userNorm = entry.score * 10;
    result.scoreDelta = userNorm - entry.media.averageScore;
  }

  // Binge stats: how long did it take to watch?
  if (entry.startedAt?.year && entry.completedAt?.year &&
      entry.startedAt.month && entry.completedAt.month &&
      entry.startedAt.day && entry.completedAt.day) {
    const start = new Date(entry.startedAt.year, entry.startedAt.month - 1, entry.startedAt.day);
    const end = new Date(entry.completedAt.year, entry.completedAt.month - 1, entry.completedAt.day);
    result.daysToComplete = Math.round((end - start) / (1000 * 60 * 60 * 24));
  }

  // Tag overlap with user's top tags
  const topTags = userStats?.statistics?.anime?.tags?.slice(0, 10)?.map((t) => t.tag.name) || [];
  const animeTags = entry.media?.genres || [];
  if (topTags.length > 0) {
    const overlap = animeTags.filter((g) => topTags.includes(g));
    result.tagOverlap = {
      count: overlap.length,
      total: topTags.length,
      tags: overlap,
    };
  }

  return result;
}

/**
 * Check franchise completion from relations + user's list.
 */
function computeFranchiseStatus(relations, allEntries) {
  if (!relations?.edges?.length || !allEntries?.length) return null;

  const animeRelations = relations.edges
    .filter((e) => e.node?.type === 'ANIME')
    .sort((a, b) => RELATION_ORDER.indexOf(a.relationType) - RELATION_ORDER.indexOf(b.relationType));

  if (animeRelations.length === 0) return null;

  const userIds = new Set(allEntries.map((e) => e.media?.id));
  const entries = animeRelations.map((rel) => ({
    id: rel.node.id,
    title: rel.node.title?.romaji || 'Unknown',
    relationType: rel.relationType,
    format: rel.node.format,
    coverImage: rel.node.coverImage?.medium,
    onUserList: userIds.has(rel.node.id),
  }));

  const watched = entries.filter((e) => e.onUserList).length;

  return {
    entries,
    watched,
    total: entries.length,
  };
}

export default function AnimeInfoPage({ allEntries, userStats }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const animeId = parseInt(id, 10);

  const { data: animeData, isLoading, error } = useQuery({
    queryKey: ['anime', animeId],
    queryFn: () => queryAniList(ANIME_INFO_QUERY, { id: animeId }),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: !isNaN(animeId),
  });

  const anime = animeData?.Media;
  const userContext = anime ? computeUserContext(animeId, allEntries, userStats) : null;
  const franchise = anime ? computeFranchiseStatus(anime.relations, allEntries) : null;
  const description = stripHtml(anime?.description);

  if (isLoading) {
    return (
      <div className="loading-container texture-halftone">
        <div className="loading-spinner" />
        <div className="loading-text">LOADING ANIME INFO...</div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="loading-container texture-halftone">
        <div className="error-box" style={{ maxWidth: '500px' }}>
          <h3 className="error-title">⚠ ANIME NOT FOUND</h3>
          <p className="error-message">{error?.message || 'Could not fetch anime data.'}</p>
          <button onClick={() => navigate(-1)} className="neo-btn neo-btn-secondary">
            GO BACK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="anime-info-page">
      {/* Top Navigation Header */}
      <header className="dash-header texture-grid">
        <div className="container">
          <div className="dash-header-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                className="neo-btn neo-btn-outline"
                onClick={() => navigate(-1)}
                aria-label="Go back"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.85rem' }}
              >
                <ArrowLeft size={20} strokeWidth={3} />
                <span style={{ fontWeight: 900, fontSize: '0.85rem' }}>BACK</span>
              </button>
              <div>
                <h2 className="dash-username" style={{ fontSize: '1.25rem', marginBottom: 0 }}>
                  ANIME DOSSIER
                </h2>
                <span
                  className="neo-badge neo-badge-pill neo-badge-accent"
                  style={{ transform: 'rotate(-1deg)', fontSize: '0.65rem' }}
                >
                  STATS FOR NERDS
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/stats" className="neo-btn neo-btn-secondary" style={{ fontSize: '0.75rem', padding: '0.5rem 0.85rem' }}>
                STATS DASHBOARD
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Visual Banner Strip (clean, with NO overlaid buttons) */}
      {anime.bannerImage && (
        <div className="anime-banner-strip" style={{ backgroundImage: `url(${anime.bannerImage})` }}>
          <div className="anime-banner-gradient" />
        </div>
      )}

      {/* Main content */}
      <section className="section texture-halftone">
        <div className="container relative z-1">
          <div className="anime-info-layout">
            {/* Left: Cover & Quick Info */}
            <div className="anime-cover-col">
              {anime.coverImage?.large && (
                <img
                  src={anime.coverImage.large}
                  alt={anime.title.romaji || anime.title.english}
                  className="anime-cover-img"
                />
              )}
              {/* Quick Facts */}
              <div className="anime-quick-facts">
                {anime.format && (
                  <div className="anime-fact">
                    <Film size={14} strokeWidth={3} />
                    <span>{FORMAT_LABELS[anime.format] || anime.format}</span>
                  </div>
                )}
                {anime.episodes && (
                  <div className="anime-fact">
                    <Tv size={14} strokeWidth={3} />
                    <span>{anime.episodes} episodes</span>
                  </div>
                )}
                {anime.duration && (
                  <div className="anime-fact">
                    <Clock size={14} strokeWidth={3} />
                    <span>{anime.duration} min/ep</span>
                  </div>
                )}
                {anime.seasonYear && (
                  <div className="anime-fact">
                    <Calendar size={14} strokeWidth={3} />
                    <span>{anime.season ? `${anime.season.charAt(0)}${anime.season.slice(1).toLowerCase()} ` : ''}{anime.seasonYear}</span>
                  </div>
                )}
                {anime.status && (
                  <div className="anime-fact">
                    <span className="neo-badge neo-badge-pill" style={{ fontSize: '0.65rem', background: anime.status === 'FINISHED' ? '#6BCB77' : anime.status === 'RELEASING' ? '#4D96FF' : '#FFD93D' }}>
                      {STATUS_LABELS[anime.status] || anime.status}
                    </span>
                  </div>
                )}
              </div>
              {/* AniList link */}
              <a
                href={`https://anilist.co/anime/${anime.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="neo-btn neo-btn-outline"
                style={{ width: '100%', textAlign: 'center', fontSize: '0.75rem', marginTop: '0.75rem' }}
              >
                <ExternalLink size={14} strokeWidth={3} />
                VIEW ON ANILIST
              </a>
            </div>

            {/* Right: Details */}
            <div className="anime-detail-col">
              {/* Title */}
              <h1 className="anime-title-main">{anime.title.romaji || anime.title.english}</h1>
              {anime.title.english && anime.title.english !== anime.title.romaji && (
                <div className="anime-title-alt">{anime.title.english}</div>
              )}

              {/* Score + Popularity row */}
              <div className="anime-scores-row">
                {anime.averageScore && (
                  <div className="anime-score-badge">
                    <Star size={18} strokeWidth={3} />
                    <span className="anime-score-value">{anime.averageScore}%</span>
                    <span className="anime-score-label">GLOBAL SCORE</span>
                  </div>
                )}
                {anime.popularity && (
                  <div className="anime-score-badge" style={{ borderColor: '#4D96FF' }}>
                    <Users size={18} strokeWidth={3} />
                    <span className="anime-score-value">{anime.popularity.toLocaleString()}</span>
                    <span className="anime-score-label">POPULARITY</span>
                  </div>
                )}
                {anime.studios?.nodes?.length > 0 && (
                  <div className="anime-score-badge" style={{ borderColor: '#C4B5FD' }}>
                    <Film size={18} strokeWidth={3} />
                    <span className="anime-score-value" style={{ fontSize: '0.9rem' }}>{anime.studios.nodes[0].name}</span>
                    <span className="anime-score-label">STUDIO</span>
                  </div>
                )}
              </div>

              {/* User Context Section */}
              {userContext && userContext.onList && (
                <div className="neo-card" style={{ marginBottom: '1.5rem' }}>
                  <div className="neo-card-header neo-card-header-accent">
                    <div className="flex-center" style={{ width: 36, height: 36, border: '3px solid #000', background: 'var(--neo-white)' }}>
                      <Star size={20} strokeWidth={3} />
                    </div>
                    <h3>YOUR STATS</h3>
                  </div>
                  <div className="neo-card-body">
                    <div className="stat-mini-grid">
                      {/* User score vs global */}
                      {userContext.score > 0 && (
                        <div className={`stat-mini ${userContext.scoreDelta > 0 ? 'stat-mini-green' : userContext.scoreDelta < 0 ? 'stat-mini-accent' : 'stat-mini-blue'}`}>
                          <div className="stat-mini-value">{userContext.score}/10</div>
                          <div className="stat-mini-label">YOUR SCORE</div>
                          {userContext.scoreDelta !== undefined && (
                            <div className="stat-mini-sub" style={{ color: userContext.scoreDelta > 0 ? '#6BCB77' : userContext.scoreDelta < 0 ? '#FF6B6B' : '#4D96FF' }}>
                              {userContext.scoreDelta > 0 ? '+' : ''}{userContext.scoreDelta} vs. global
                            </div>
                          )}
                        </div>
                      )}

                      {/* Binge speed */}
                      {userContext.daysToComplete !== undefined && (
                        <div className="stat-mini stat-mini-secondary">
                          <div className="stat-mini-value">
                            {userContext.daysToComplete === 0 ? 'SAME DAY' : `${userContext.daysToComplete}d`}
                          </div>
                          <div className="stat-mini-label">TIME TO COMPLETE</div>
                          <div className="stat-mini-sub">
                            {userContext.daysToComplete === 0 ? 'Binged in one sitting!' : userContext.daysToComplete <= 3 ? 'Speed binge!' : userContext.daysToComplete <= 14 ? 'Steady pace' : 'Slow burn'}
                          </div>
                        </div>
                      )}

                      {/* Repeat count */}
                      {userContext.repeat > 0 && (
                        <div className="stat-mini stat-mini-muted">
                          <div className="stat-mini-value">{userContext.repeat}×</div>
                          <div className="stat-mini-label">REWATCHED</div>
                        </div>
                      )}

                      {/* Status */}
                      <div className="stat-mini stat-mini-blue">
                        <div className="stat-mini-value" style={{ fontSize: '1rem' }}>
                          {userContext.status?.replace(/_/g, ' ') || 'ON LIST'}
                        </div>
                        <div className="stat-mini-label">LIST STATUS</div>
                        {userContext.progress > 0 && anime.episodes && userContext.status !== 'COMPLETED' && (
                          <div className="stat-mini-sub">
                            {userContext.progress}/{anime.episodes} episodes ({Math.round((userContext.progress / anime.episodes) * 100)}%)
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tag overlap */}
                    {userContext.tagOverlap && userContext.tagOverlap.count > 0 && (
                      <div style={{ marginTop: '1rem', padding: '0.75rem', border: 'var(--border-thin)', background: 'var(--neo-bg)' }}>
                        <div style={{ fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
                          <Tag size={14} strokeWidth={3} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.4rem' }} />
                          SHARES {userContext.tagOverlap.count} OF YOUR TOP {userContext.tagOverlap.total} GENRES
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {userContext.tagOverlap.tags.map((t) => (
                            <span key={t} className="neo-badge neo-badge-pill neo-badge-accent" style={{ fontSize: '0.65rem' }}>{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Not on list message */}
              {userContext && !userContext.onList && (
                <div style={{ marginBottom: '1.5rem', padding: '1rem', border: 'var(--border-default)', background: 'var(--neo-secondary)', boxShadow: 'var(--shadow-sm)' }}>
                  <span style={{ fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <BookmarkX size={16} strokeWidth={3} />
                    NOT ON YOUR LIST
                  </span>
                </div>
              )}

              {/* Synopsis */}
              {description && (
                <div className="neo-card" style={{ marginBottom: '1.5rem' }}>
                  <div className="neo-card-header neo-card-header-secondary">
                    <h3>SYNOPSIS</h3>
                  </div>
                  <div className="neo-card-body">
                    <p className="anime-synopsis">{description}</p>
                  </div>
                </div>
              )}

              {/* Genres & Tags */}
              <div className="neo-card" style={{ marginBottom: '1.5rem' }}>
                <div className="neo-card-header neo-card-header-muted">
                  <h3>GENRES & TAGS</h3>
                </div>
                <div className="neo-card-body">
                  {anime.genres?.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>GENRES</div>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {anime.genres.map((g) => (
                          <span key={g} className="neo-badge neo-badge-accent" style={{ fontSize: '0.7rem' }}>{g}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {anime.tags?.length > 0 && (
                    <div>
                      <div style={{ fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>TAGS</div>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {anime.tags.slice(0, 15).map((t) => (
                          <span key={t.name} className="neo-badge neo-badge-pill" style={{ background: 'var(--neo-bg)', fontSize: '0.65rem' }}>
                            {t.name} <span style={{ opacity: 0.5 }}>{t.rank}%</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Franchise / Relations */}
              {franchise && franchise.entries.length > 0 && (
                <div className="neo-card">
                  <div className="neo-card-header neo-card-header-secondary">
                    <h3>FRANCHISE</h3>
                    <span className="neo-badge neo-badge-pill neo-badge-accent" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
                      {franchise.watched} OF {franchise.total} WATCHED
                    </span>
                  </div>
                  <div className="neo-card-body">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {franchise.entries.map((rel) => (
                        <Link
                          key={rel.id}
                          to={`/anime/${rel.id}`}
                          className="contrarian-card"
                          style={{ textDecoration: 'none', color: 'inherit', opacity: rel.onUserList ? 1 : 0.6 }}
                        >
                          {rel.coverImage && (
                            <img src={rel.coverImage} alt="" className="contrarian-cover" loading="lazy" />
                          )}
                          <div className="contrarian-info">
                            <div className="contrarian-title">{rel.title}</div>
                            <div className="contrarian-scores">
                              <span>{RELATION_LABELS[rel.relationType] || rel.relationType}</span>
                              {rel.format && <span>· {FORMAT_LABELS[rel.format] || rel.format}</span>}
                            </div>
                          </div>
                          <div className="contrarian-diff" style={{ color: rel.onUserList ? '#6BCB77' : '#FF6B6B', display: 'flex', alignItems: 'center' }}>
                            {rel.onUserList ? <Check size={18} strokeWidth={3} /> : <X size={18} strokeWidth={3} />}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>
            ANIME STATS FOR NERDS · Data from{' '}
            <a href="https://anilist.co" target="_blank" rel="noopener noreferrer">AniList</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
