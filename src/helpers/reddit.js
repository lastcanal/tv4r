const REDDIT_API_HOST = 'https://www.reddit.com'


const chompTrailingSlash = (string = '') => (
  string.endsWith('/') ? string.slice(0, -1) : string
)

export const postURL = (permalink, extention = 'json') => (
  new URL(
    encodeURI(`${chompTrailingSlash(permalink)}.${extention}`),
    REDDIT_API_HOST
  )
)

export const replyURL = (permalink, parentId = '', extention = 'json') => (
  new URL(
    encodeURI(`${chompTrailingSlash(permalink)}/${parentId}.${extention}`),
    REDDIT_API_HOST
  )
)

export const subredditURL = (subreddit, extention = 'json', limit = 100) => (
  new URL(
    encodeURI(
      `/r/${chompTrailingSlash(subreddit)}.${extention}?limit=${limit}`
    ),
    REDDIT_API_HOST
  )
)

export const fetchPosts = subreddit => (
  fetch(subredditURL(subreddit).href)
)

export const fetchPost = (permalink) => (
  fetch(postURL(permalink).href)
)

export const fetchReplies = (permalink, parentId) => (
  fetch(replyURL(permalink, parentId).href)
)

export default { fetchPosts, fetchPost, fetchReplies, postURL, replyURL }

