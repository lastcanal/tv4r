const REDDIT_API_HOST = 'https://www.reddit.com'

export const fetchPosts = subreddit => {
  const url = new URL(`/r/${subreddit}.json?limit=100`, REDDIT_API_HOST)
  return fetch(url.href)
}

export const fetchPost = permalink => {
  const url = new URL(`${permalink}.json`, REDDIT_API_HOST)
  return fetch(url.href)
}

export default { fetchPosts, fetchPost }
