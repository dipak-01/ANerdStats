import { Link } from 'react-router-dom';

/**
 * Reusable link component for anime titles.
 * Wraps children in a <Link> to /anime/:id.
 */
export default function AnimeLink({ id, children, className }) {
  if (!id) return <span className={className}>{children}</span>;
  return (
    <Link to={`/anime/${id}`} className={`anime-link ${className || ''}`}>
      {children}
    </Link>
  );
}
