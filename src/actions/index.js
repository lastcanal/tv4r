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
  TOGGLE_FULLSCREEN,
  TOGGLE_PLAY,
  TOGGLE_AUTOPLAY,
  TOGGLE_THEME_MODE,
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

export const nextPost = posts => ({
  type: NEXT_POST,
  posts,
})

export const previousPost = posts => ({
  type: PREVIOUS_POST,
  posts,
})

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
    (match && match.subreddit === subreddit)
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
  if (posts[index] && !posts[index].comments) {
    dispatch(fetchComments(posts[index], selectedSubreddit))
  }
}

export const configToggleFullscreen = () => ({
  type: TOGGLE_FULLSCREEN,
})

export const configToggleAutoplay = () => ({
  type: TOGGLE_AUTOPLAY,
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

export const handleKeyboardAction = event => (dispatch, getState) => {
  const { postsBySubreddit, selectedSubreddit } = getState()
  const posts = postsBySubreddit[selectedSubreddit] &&
    postsBySubreddit[selectedSubreddit].items
  switch (event.key) {
    case '.':
    case '>':
      return dispatch(nextPost(posts))
    case 'N':
    case 'n':
      return event.shiftKey ? dispatch(nextPost(posts)) : void (0)
    case ',':
    case '<':
      return dispatch(previousPost(posts))
    case 'P':
    case 'p':
      return event.shiftKey ? dispatch(previousPost(posts)) : void (0)
    case ' ':
    case 'Enter':
    case 'k':
      return dispatch(configTogglePlay())
    case 'a':
      return dispatch(configToggleAutoplay())
    case 'f':
      return dispatch(configToggleFullscreen())
    case 'ArrowLeft':
      return dispatch(playerScanBackwards(5))
    case 'ArrowRight':
      return dispatch(playerScanForwards(5))
    case 'ArrowUp':
      return dispatch(playerVolumeUp())
    case 'ArrowDown':
      return dispatch(playerVolumeDown())
    default:
      const jumpTo = parseInt(event.key)
      if (jumpTo) {
        return dispatch(playerJumpTo(jumpTo))
      } else {
        return
      }
  }
}
