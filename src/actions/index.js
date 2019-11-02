import { batch } from 'react-redux'

import { extractPosts, filterPosts, matchRedditPath } from '../helpers'
import reddit from '../helpers/reddit'

import {
  SELECT_SUBREDDIT,
  INVALIDATE_SUBREDDIT,
  REMOVE_SUBREDDIT,
  REQUEST_POSTS,
  RECEIVE_POSTS,
  RECEIVE_POSTS_ERROR,
  SELECT_POST,
  NEXT_POST,
  PREVIOUS_POST,
  MEDIA_FALLBACK,
  REQUEST_COMMENTS,
  RECEIVE_COMMENTS,
  RECEIVE_COMMENTS_ERROR,
  ENABLE_FULLSCREEN,
  DISABLE_FULLSCREEN,
  TOGGLE_FULLSCREEN,
  TOGGLE_PLAY,
  TOGGLE_AUTO_ADVANCE,
  TOGGLE_THEME_MODE,
  ENABLE_KEYBORAD_CONTROLS,
  DISABLE_KEYBORAD_CONTROLS,
  PLAYER_VOLUME_UP,
  PLAYER_VOLUME_DOWN,
  PLAYER_SCAN_FORWARDS,
  PLAYER_SCAN_BACKWARDS,
  PLAYER_SCAN_ACK,
  PLAYER_JUMP_TO,
  PLAYER_JUMP_ACK,
} from '../constants'

export const selectSubreddit = subreddit => ({
  type: SELECT_SUBREDDIT,
  subreddit,
})

export const invalidateSubreddit = subreddit => ({
  type: INVALIDATE_SUBREDDIT,
  subreddit,
})

export const removeSubreddit = subreddit => ({
  type: REMOVE_SUBREDDIT,
  subreddit,
})

export const requestPosts = subreddit => ({
  type: REQUEST_POSTS,
  subreddit,
})

export const receivePosts = (subreddit, json) => ({
  type: RECEIVE_POSTS,
  subreddit,
  posts: filterPosts(extractPosts(json)),
  error: null,
  receivedAt: Date.now(),
})

export const receivePostsError = (subreddit, error) => ({
  type: RECEIVE_POSTS_ERROR,
  subreddit,
  error,
})

export const selectPost = (post, index) => ({
  type: SELECT_POST,
  post,
  index,
})

export const nextPost = () => (dispatch, getState) => {
  const { postsBySubreddit, selectedSubreddit } = getState()
  return dispatch({
    type: NEXT_POST,
    posts: postsBySubreddit[selectedSubreddit]?.items,
  })
}

export const previousPost = () => (dispatch, getState) => {
  const { postsBySubreddit, selectedSubreddit } = getState()
  return dispatch({
    type: PREVIOUS_POST,
    posts: postsBySubreddit[selectedSubreddit]?.items,
  })
}

export const mediaFallback = () => ({
  type: MEDIA_FALLBACK,
})

const fetchPosts = subreddit => dispatch => {
  dispatch(requestPosts(subreddit))
  return reddit
    .fetchPosts(subreddit)
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
  return (
    !posts ||
    posts.items.length === 0 ||
    (match?.subreddit === subreddit)
  )
}

export const invalidateSubredditIfNeeded = subreddit => (
  dispatch,
  getState,
) => {
  const newSubreddit = subreddit.toLowerCase()
  if (shouldInvalidateSubreddit(getState(), newSubreddit)) {
    return dispatch(invalidateSubreddit(newSubreddit))
  }
}

export const loadSubreddit = subreddit => (dispatch) => {
  batch(() => {
    dispatch(selectSubreddit(subreddit))
    dispatch(invalidateSubredditIfNeeded(subreddit))
    dispatch(fetchPostsIfNeeded(subreddit))
  })
}

const requestComments = (post, subreddit) => ({
  type: REQUEST_COMMENTS,
  post,
  subreddit,
})

const receiveComments = (post, subreddit, response) => ({
  type: RECEIVE_COMMENTS,
  post,
  subreddit,
  comments: response,
})

const receiveCommentsError = (post, subreddit, error) => ({
  type: RECEIVE_COMMENTS_ERROR,
  post,
  subreddit,
  error,
})

const fetchComments = (post, selectedSubreddit) => dispatch => {
  if (!post?.permalink) return
  dispatch(requestComments(post, selectedSubreddit))
  return reddit
    .fetchPost(post.permalink)
    .then(response => response.json())
    .catch(error =>
      dispatch(receiveCommentsError(post, selectedSubreddit, error)),
    )
    .then(response =>
      dispatch(receiveComments(post, selectedSubreddit, response)),
    )
}

export const fetchCommentsIfNeeded = () => (dispatch, getState) => {
  const { postsBySubreddit, selectedSubreddit } = getState()
  const { index } = postsBySubreddit.cursor
  const posts = postsBySubreddit[selectedSubreddit].items
  if (!posts[index]?.comments) {
    dispatch(fetchComments(posts[index], selectedSubreddit))
  }
}

export const configToggleFullscreen = () => ({
  type: TOGGLE_FULLSCREEN,
})

export const configEnableFullscreen = () => ({
  type: ENABLE_FULLSCREEN,
})

export const configDisableFullscreen = () => ({
  type: DISABLE_FULLSCREEN,
})

export const configToggleAutoAdvance = () => ({
  type: TOGGLE_AUTO_ADVANCE,
})

export const configTogglePlay = () => ({
  type: TOGGLE_PLAY,
})

export const configToggleThemeMode = () => ({
  type: TOGGLE_THEME_MODE,
})

export const playerScanForwards = seconds => ({
  type: PLAYER_SCAN_FORWARDS,
  seconds,
})

export const playerScanBackwards = seconds => ({
  type: PLAYER_SCAN_BACKWARDS,
  seconds,
})

export const playerScanAck = () => ({
  type: PLAYER_SCAN_ACK,
})

export const playerJumpTo = (number) => ({
  type: PLAYER_JUMP_TO,
  percentage: (number / 10),
})

export const playerJumpAck = () => ({
  type: PLAYER_JUMP_ACK,
})

export const playerVolumeDown = () => ({
  type: PLAYER_VOLUME_DOWN,
})

export const playerVolumeUp = () => ({
  type: PLAYER_VOLUME_UP,
})

export const enableKeyboardControls = () => ({
  type: ENABLE_KEYBORAD_CONTROLS,
})

export const disableKeyboardControls = () => ({
  type: DISABLE_KEYBORAD_CONTROLS,
})
