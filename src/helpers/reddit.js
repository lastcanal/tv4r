const REDDIT_API_HOST = 'https://www.reddit.com'

export const fetchPosts = subreddit => {
  const url = new URL(
    encodeURI(`/r/${subreddit}.json?limit=100`),
    REDDIT_API_HOST
  )

  return fetch(url.href)
}

export const fetchPost = (permalink) => {
  const url = new URL(
    encodeURI(`${permalink}.json`),
    REDDIT_API_HOST
  )

  return fetch(url.href)
}

export const fetchReplies = (permalink, parentId) => {
  const url = new URL(
    encodeURI(`${permalink}${parentId}.json`),
    REDDIT_API_HOST
  )

  return fetch(url.href)
}

export default { fetchPosts, fetchPost, fetchReplies }

