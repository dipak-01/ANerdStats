// AniList GraphQL query strings

// Query 1: Aggregate user statistics (built-in stats)
export const USER_STATS_QUERY = `
query ($name: String) {
  User(name: $name) {
    id
    name
    avatar {
      large
    }
    statistics {
      anime {
        count
        meanScore
        minutesWatched
        episodesWatched
        standardDeviation
        genres(sort: COUNT_DESC) {
          genre
          count
          meanScore
          minutesWatched
        }
        studios(sort: COUNT_DESC) {
          studio {
            name
          }
          count
          meanScore
        }
        tags(sort: COUNT_DESC, limit: 30) {
          tag {
            name
            category
          }
          count
          meanScore
        }
        releaseYears(sort: MEAN_SCORE_DESC) {
          releaseYear
          count
          meanScore
        }
        statuses {
          status
          count
        }
        formats {
          format
          count
        }
        countries {
          country
          count
        }
        staff(sort: COUNT_DESC, limit: 10) {
          staff {
            name {
              full
            }
          }
          count
          meanScore
        }
      }
    }
  }
}
`;

// Query 2: Raw list data (for derived stats like binge, taste correlation)
export const USER_LIST_QUERY = `
query ($userName: String) {
  MediaListCollection(userName: $userName, type: ANIME) {
    lists {
      name
      status
      entries {
        status
        score(format: POINT_10)
        progress
        repeat
        startedAt {
          year
          month
          day
        }
        completedAt {
          year
          month
          day
        }
        media {
          id
          title {
            romaji
            english
          }
          episodes
          averageScore
          popularity
          genres
          seasonYear
          season
          format
          coverImage {
            medium
          }
          relations {
            edges {
              relationType
              node {
                id
                title {
                  romaji
                }
                type
                format
              }
            }
          }
        }
      }
    }
  }
}
`;

// Query 3: Single anime info page (for /anime/:id route)
export const ANIME_INFO_QUERY = `
query ($id: Int) {
  Media(id: $id) {
    id
    title {
      romaji
      english
    }
    description(asHtml: false)
    coverImage {
      large
      medium
    }
    bannerImage
    format
    episodes
    duration
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
    season
    averageScore
    popularity
    status
    source
    relations {
      edges {
        relationType
        node {
          id
          title {
            romaji
          }
          type
          format
          coverImage {
            medium
          }
        }
      }
    }
  }
}
`;
