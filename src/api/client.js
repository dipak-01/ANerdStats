// AniList GraphQL API client with retry + backoff

const ANILIST_URL = 'https://graphql.anilist.co';

/**
 * Execute a GraphQL query against AniList API with retry on rate limit.
 * @param {string} query - GraphQL query string
 * @param {object} variables - Query variables
 * @param {number} retries - Number of retries remaining
 * @returns {Promise<object>} - Response data
 */
export async function queryAniList(query, variables = {}, retries = 3) {
  const response = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  // Retry on rate limit (429)
  if (response.status === 429 && retries > 0) {
    const retryAfter = parseInt(response.headers.get('retry-after') || '5', 10);
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
    return queryAniList(query, variables, retries - 1);
  }

  if (!response.ok) {
    const errorBody = await response.text();
    if (response.status === 404) {
      throw new Error('User not found. Check the username and try again.');
    }
    if (response.status === 429) {
      throw new Error('Rate limited by AniList. Please wait a moment and try again.');
    }
    throw new Error(`AniList API error (${response.status}): ${errorBody}`);
  }

  const json = await response.json();

  if (json.errors) {
    const message = json.errors.map(e => e.message).join(', ');
    if (message.toLowerCase().includes('not found') || message.toLowerCase().includes('private')) {
      throw new Error('User not found or profile is private.');
    }
    throw new Error(`AniList error: ${message}`);
  }

  return json.data;
}
