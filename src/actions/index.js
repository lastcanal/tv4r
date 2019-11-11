import { batch } from 'react-redux'

import { extractPosts, matchRedditPath } from '../helpers'
import reddit from '../helpers/reddit'
import { mediaSelector } from '../selectors'

import {
  SELECT_SUBREDDIT,
  INVALIDATE_SUBREDDIT,
  REMOVE_SUBREDDIT,
  SELECT_SUBREDDIT_SCOPE,
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
  REQUEST_REPLIES,
  RECEIVE_REPLIES,
  RECEIVE_REPLIES_ERROR,
  ENABLE_FULLSCREEN,
  DISABLE_FULLSCREEN,
  TOGGLE_FULLSCREEN,
  TOGGLE_PLAY,
  TOGGLE_AUTO_ADVANCE,
  TOGGLE_THEME_MODE,
  TOGGLE_NSFW,
  TOGGLE_SHOW_IMAGES,
  TOGGLE_SHOW_VIDEOS,
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

export const requestPosts = (subreddit, scope = 'hot') => ({
  type: REQUEST_POSTS,
  subreddit,
  scope,
})

export const receivePosts = (subreddit, scope, json) =>
  (dispatch, getState) => {
    const { config } = getState()
    const { showVideos, showImages, showNSFW } = config
    const posts = extractPosts(json)
    return dispatch({
      type: RECEIVE_POSTS,
      subreddit,
      posts,
      error: null,
      receivedAt: Date.now(),
      showVideos,
      showImages,
      showNSFW,
      scope,
    })
  }

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

const translatePost = (type) => (dispatch, getState) => {
  const { postsBySubreddit, selectedSubreddit, config } = getState()
  const { showImages, showVideos, showNSFW } = config
  const subreddit = postsBySubreddit[selectedSubreddit]
  const posts = subreddit?.[subreddit.scope]
  return dispatch({
    type: type,
    posts: mediaSelector({ posts, showImages, showVideos, showNSFW }),
  })
}

export const nextPost = () => (dispatch) => {
  dispatch(translatePost(NEXT_POST))
}
export const previousPost = () => (dispatch) => {
  dispatch(translatePost(PREVIOUS_POST))
}

export const mediaFallback = () => ({
  type: MEDIA_FALLBACK,
})

const fetchPosts = subreddit => (dispatch, getState) => {
  const { postsBySubreddit } = getState()
  const scope = postsBySubreddit?.[subreddit]?.scope || 'hot'
  dispatch(requestPosts(subreddit, scope))
  return reddit
    .fetchPosts(subreddit, scope)
    .then(response => response.json())
    .then(response => dispatch(receivePosts(subreddit, scope, response)))
    .catch(error => dispatch(receivePostsError(subreddit, error)))
}

const shouldFetchPosts = ({ postsBySubreddit }, selected) => {
  const subreddit = postsBySubreddit[selected]
  const posts = subreddit?.[subreddit?.scope]
  if (!posts) {
    return true
  }
  if (subreddit.isFetching) {
    return false
  }
  return subreddit.didInvalidate
}

export const fetchPostsIfNeeded = subreddit => (dispatch, getState) => {
  if (shouldFetchPosts(getState(), subreddit)) {
    return dispatch(fetchPosts(subreddit))
  }
}

const shouldInvalidateSubreddit = ({ router, postsBySubreddit }, selected) => {
  const match = matchRedditPath(router.location.pathname)
  const subreddit = postsBySubreddit[selected]
  return (
    !subreddit ||
    subreddit?.[subreddit.scope]?.length === 0 ||
    (match?.subreddit === selected)
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

export const refreshSubreddit = () => (dispatch, getState) => {
  const { selectedSubreddit } = getState()
  batch(() => {
    dispatch(invalidateSubreddit(selectedSubreddit))
    dispatch(fetchPostsIfNeeded(selectedSubreddit))
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
  const subreddit = postsBySubreddit[selectedSubreddit]
  const comments = subreddit.comments
  const items = subreddit[subreddit.scope]
  const post = items[index]
  if (!comments?.[post?.id]) {
    dispatch(fetchComments(items[index], selectedSubreddit))
  }
}

const requestReplies = (post, subreddit, parentId) => ({
  type: REQUEST_REPLIES,
  post,
  subreddit,
  parentId,
})

const receiveReplies = (post, subreddit, parentId, response) => ({
  type: RECEIVE_REPLIES,
  post,
  subreddit,
  comments: response,
  parentId,
})

const receiveRepliesError = (post, subreddit, parentId, error) => ({
  type: RECEIVE_REPLIES_ERROR,
  post,
  subreddit,
  error,
  parentId,
})

const fetchReplies = (post, selectedSubreddit, parentId) => dispatch => {
  dispatch(requestReplies(post, selectedSubreddit, parentId))
  return reddit
    .fetchReplies(post.permalink, parentId)
    .then(response => response.json())
    .catch(error =>
      dispatch(receiveRepliesError(post, selectedSubreddit, parentId, error)),
    )
    .then(response =>
      dispatch(receiveReplies(post, selectedSubreddit, parentId, response)),
    )
}

export const fetchRepliesIfNeeded = ({ data }) => (dispatch, getState) => {
  const { postsBySubreddit, selectedSubreddit } = getState()
  const { index } = postsBySubreddit.cursor
  const subreddit = postsBySubreddit[selectedSubreddit]
  const comments = subreddit.comments
  const items = subreddit[subreddit.scope]
  const post = items[index]
  const commentsForPost = comments?.[post?.id] || {}
  const { groups: { parentId } } =
    /^t1_(?<parentId>\w+)$/.exec(data.parent_id)

  if (parentId && !commentsForPost[parentId]) {
    dispatch(fetchReplies(items[index], selectedSubreddit, parentId))
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

export const configToggleNSFW = () => ({
  type: TOGGLE_NSFW,
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

const configToggleFilter = (type) => (dispatch, getState) => {
  const { postsBySubreddit, selectedSubreddit, config } = getState()
  const { showImages, showVideos, showNSFW } = config
  const subreddit = postsBySubreddit[selectedSubreddit]
  const items = subreddit[subreddit.scope]
  const { post } = postsBySubreddit.cursor
  const action = {
    type,
    post,
  }
  const posts = mediaSelector({
    posts: items,
    showImages: type === TOGGLE_SHOW_IMAGES ? !showImages : showImages,
    showVideos: type === TOGGLE_SHOW_VIDEOS ? !showVideos : showVideos,
    showNSFW,
  })
  return dispatch({ ...action, posts })
}

export const configToggleShowVideos = () => (dispatch) => (
  dispatch(configToggleFilter(TOGGLE_SHOW_VIDEOS))
)

export const configToggleShowImages = () => (dispatch) => (
  dispatch(configToggleFilter(TOGGLE_SHOW_IMAGES))
)

export const selectSubredditScope = (subreddit, scope) => (dispatch) => {
  return batch(() => {
    dispatch({
      type: SELECT_SUBREDDIT_SCOPE,
      subreddit: subreddit,
      scope: scope.toLowerCase(),
    })
    dispatch(invalidateSubredditIfNeeded(subreddit))
    dispatch(fetchPostsIfNeeded(subreddit))
  })
}

