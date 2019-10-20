import { extractPosts, filterPosts, matchRedditPath } from '../helpers'
import reddit from '../helpers/reddit'

import {
  SELECT_SUBREDDIT, INVALIDATE_SUBREDDIT,
  REQUEST_POSTS, RECEIVE_POSTS, RECEIVE_POSTS_ERROR,
  SELECT_POST, NEXT_POST, PREVIOUS_POST,
  MEDIA_FALLBACK
} from '../constants'

export const selectSubreddit = subreddit => ({
  type: SELECT_SUBREDDIT,
  subreddit
})

export const invalidateSubreddit = subreddit => ({
  type: INVALIDATE_SUBREDDIT,
  subreddit
})

export const requestPosts = subreddit => ({
  type: REQUEST_POSTS,
  subreddit
})

export const receivePosts = (subreddit, json) => ({
  type: RECEIVE_POSTS,
  subreddit,
  posts: filterPosts(extractPosts(json)),
  error: null,
  receivedAt: Date.now()
})

export const receivePostsError = (subreddit, error) => ({
  type: RECEIVE_POSTS_ERROR,
  subreddit,
  error
})

export const selectPost = (post, index) => ({
  type: SELECT_POST,
  post,
  index
})

export const nextPost = (posts) => ({
  type: NEXT_POST,
  posts
})

export const previousPost = (posts) => ({
  type: PREVIOUS_POST,
  posts
})

export const mediaFallback = () => ({
  type: MEDIA_FALLBACK
})

const fetchPosts = subreddit => dispatch => {
  dispatch(requestPosts(subreddit))
  return reddit.fetchPosts(subreddit)
    .then(response => response.json())
    .then(response => dispatch(receivePosts(subreddit, response)))
    .catch(error => dispatch(receivePostsError(subreddit, error)))
}

const shouldFetchPosts = ({ postsBySubreddit }, subreddit) => {
  const posts = postsBySubreddit[subreddit]
  if (!posts) {
    return true
  }
  if (posts.isFetching) {
    return false
  }
  return posts.didInvalidate
}

export const fetchPostsIfNeeded = subreddit => (dispatch, getState) => {
  if (shouldFetchPosts(getState(), subreddit)) {
    return dispatch(fetchPosts(subreddit))
  }
}

const shouldInvalidateSubreddit = ({ router, postsBySubreddit }, subreddit) => {
  const match = matchRedditPath(router.location.pathname)
  const posts = postsBySubreddit[subreddit]
  return !posts || posts.items.length === 0 || (match && match.subreddit === subreddit)
}

export const invalidateSubredditIfNeeded = subreddit => (dispatch, getState) => {
  if (shouldInvalidateSubreddit(getState(), subreddit)) {
    return dispatch(invalidateSubreddit(subreddit))
  }
}
