import { combineReducers } from 'redux'
import { connectRouter, LOCATION_CHANGE } from 'connected-react-router'

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
  DEFAULT_SUBREDDIT,
  DEFAULT_SUBREDDITS,
  ENABLE_FULLSCREEN,
  DISABLE_FULLSCREEN,
  TOGGLE_FULLSCREEN,
  TOGGLE_AUTO_ADVANCE,
  TOGGLE_PLAY,
  TOGGLE_THEME_MODE,
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

import {
  matchRedditPath,
  findPostById,
  extractPost,
  getNewSubredditFromPath,
  didInvalidateSubredditFromPath,
  translateVolume,
} from '../helpers'

export const selectedSubreddit = (state = DEFAULT_SUBREDDIT, action) => {
  switch (action.type) {
    case SELECT_SUBREDDIT:
      return action.subreddit
    case LOCATION_CHANGE:
      return getNewSubredditFromPath(state, action)
    default:
      return state
  }
}

const selectedPosts = (
  state = {
    isFetching: false,
    didInvalidate: false,
    comments: {},
    scope: 'hot',
    hot: [],
    new: [],
    controversial: [],
    top: [],
    rising: [],
  },
  action,
) => {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
      return {
        ...state,
        didInvalidate: true,
      }
    case SELECT_SUBREDDIT_SCOPE:
      return {
        ...state,
        scope: action.scope,
      }
    case REQUEST_POSTS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false,
        error: null,
      }
    case RECEIVE_POSTS:
      const items = action.posts
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        [action.scope]: items,
        comments: state.comments,
        lastUpdated: action.receivedAt,
      }
    case RECEIVE_POSTS_ERROR:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        [action.scope]: [],
        error: action.error,
      }
    case LOCATION_CHANGE:
      const didInvalidate = didInvalidateSubredditFromPath(
        action.subreddit,
        action,
      )

      return {
        ...state,
        didInvalidate,
        isFetching: false,
        scope: state.scope || 'hot',
        error: null,
      }
    case REQUEST_COMMENTS:
      return {
        ...state,
        isFetchingComments: true,
        error: null,
      }
    case RECEIVE_COMMENTS:
      const comments = { ...state.comments, [action.post.id]: {
        root: action.comments,
      } }
      return {
        ...state,
        isFetchingComments: false,
        comments,
      }
    case RECEIVE_COMMENTS_ERROR:
      return {
        ...state,
        isFetchingComments: false,
        error: action.error,
      }
    case REQUEST_REPLIES:
      return {
        ...state,
        isFetchingReplies: true,
        error: null,
      }
    case RECEIVE_REPLIES:
      const replies = action.comments[1].data.children[0].data.replies
      return {
        ...state,
        isFetchingReplies: false,
        comments: {
          ...state.comments,
          [action.post.id]: {
            ...state.comments[action.post.id],
            [`t1_${action.parentId}`]: replies,
          },
        },
      }
    case RECEIVE_REPLIES_ERROR:
      return {
        ...state,
        isFetchingReplies: false,
        error: action.error,
      }

    default:
      /* istanbul ignore next */
      return state
  }
}

export const selectedPost = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_POSTS:
      return {
        ...state,
        ...extractPost(state, action),
        media_fallback: false,
      }
    case SELECT_POST:
      return {
        ...state,
        ...extractPost(state, action),
        media_fallback: false,
      }
    case NEXT_POST:
      const nextIndex = state.index + 1
      const nextPost = action.posts[nextIndex]
      return {
        ...state,
        index: nextPost ? nextIndex : 0,
        post: nextPost || action.posts[0],
        media_fallback: false,
      }
    case PREVIOUS_POST:
      const previousIndex =
        state.index - 1 >= 0 ? state.index - 1 : action.posts.length - 1
      return {
        ...state,
        index: previousIndex,
        post: action.posts[previousIndex],
        media_fallback: false,
      }
    case MEDIA_FALLBACK:
      return {
        ...state,
        media_fallback: true,
      }
    case LOCATION_CHANGE:
      const match = matchRedditPath(action.payload.location.pathname)
      if (match && (!state.post || match.params.postId !== state.post.id)) {
        return {
          ...state,
          ...findPostById(match.params.postId, action.posts),
        }
      } else {
        // istanbul ignore next
        return state
      }
    case INVALIDATE_SUBREDDIT:
      return {
        ...state,
        post: { id: state.post ? state.post.id : null },
      }
    case TOGGLE_SHOW_VIDEOS:
    case TOGGLE_SHOW_IMAGES:
      return {
        ...state,
        ...findPostById(action.post?.id, action.posts),
      }
    case SELECT_SUBREDDIT_SCOPE:
      return {
        ...state,
      }
    default:
      return state
  }
}

export const postsBySubreddit = (state = { cursor: {} }, action) => {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
    case REQUEST_POSTS:
    case RECEIVE_POSTS:
    case RECEIVE_POSTS_ERROR:
    case REQUEST_COMMENTS:
    case RECEIVE_COMMENTS:
    case RECEIVE_COMMENTS_ERROR:
    case REQUEST_REPLIES:
    case RECEIVE_REPLIES:
    case RECEIVE_REPLIES_ERROR:
    case TOGGLE_SHOW_VIDEOS:
    case TOGGLE_SHOW_IMAGES:
    case SELECT_SUBREDDIT_SCOPE:
      return {
        ...state,
        [action.subreddit]: selectedPosts(state[action.subreddit], action),
        cursor: selectedPost(state.cursor, action),
      }
    case SELECT_POST:
    case NEXT_POST:
    case PREVIOUS_POST:
    case MEDIA_FALLBACK:
      return {
        ...state,
        cursor: selectedPost(state.cursor || {}, action),
      }
    case LOCATION_CHANGE:
      const subreddit = getNewSubredditFromPath(null, action)
      const scope = state.scope || 'hot'
      const posts = state[subreddit] ? state[subreddit][scope] : []
      if (subreddit) {
        return {
          ...state,
          [subreddit]: selectedPosts(state[subreddit], {
            ...action,
            posts,
            subreddit,
          }),
          cursor: selectedPost(state.cursor, {
            ...action,
            posts,
            subreddit,
          }),
        }
      } else {
        // istanbul ignore next
        return state
      }
    case REMOVE_SUBREDDIT:
      return {
        ...state,
        [action.subreddit]: null,
      }
    default:
      return state
  }
}

const subreddits = (state = DEFAULT_SUBREDDITS, action) => {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
      const addSet = new Set(state)
      addSet.add(action.subreddit)
      return Array.from(addSet)
    case REMOVE_SUBREDDIT:
      const removeSet = new Set(state)
      removeSet.delete(action.subreddit)
      return Array.from(removeSet)
    default:
      return state
  }
}

const DEFAULT_CONFIG = {
  isFullscreen: false,
  isAutoAdvance: false,
  themeMode: 'dark',
  keyboardControls: true,
  showImages: true,
  showVideos: true,
  volume: 1,
  scan: 0,
  jump: -1,
}

const config = (state = DEFAULT_CONFIG, action) => {
  switch (action.type) {
    case ENABLE_FULLSCREEN:
      return {
        ...state,
        isFullscreen: true,
      }
    case DISABLE_FULLSCREEN:
      return {
        ...state,
        isFullscreen: false,
      }
    case TOGGLE_FULLSCREEN:
      return {
        ...state,
        isFullscreen: !state.isFullscreen,
      }
    case TOGGLE_AUTO_ADVANCE:
      return {
        ...state,
        isAutoAdvance: !state.isAutoAdvance,
      }
    case TOGGLE_PLAY:
      return {
        ...state,
        isPlaying: !state.isPlaying,
      }
    case TOGGLE_THEME_MODE:
      return {
        ...state,
        themeMode: state.themeMode === 'dark' ? 'light' : 'dark',
      }
    case TOGGLE_SHOW_IMAGES:
      return {
        ...state,
        showImages: !state.showImages,
      }
    case TOGGLE_SHOW_VIDEOS:
      return {
        ...state,
        showVideos: !state.showVideos,
      }
    case PLAYER_VOLUME_UP:
      return {
        ...state,
        volume: translateVolume(state.volume, 0.1),
      }
    case PLAYER_VOLUME_DOWN:
      return {
        ...state,
        volume: translateVolume(state.volume, -0.1),
      }
    case PLAYER_SCAN_FORWARDS:
      return {
        ...state,
        scan: action.seconds,
      }
    case PLAYER_SCAN_BACKWARDS:
      return {
        ...state,
        scan: -action.seconds,
      }
    case PLAYER_SCAN_ACK:
      return {
        ...state,
        scan: 0,
      }
    case PLAYER_JUMP_TO:
      return {
        ...state,
        jump: action.percentage,
      }
    case PLAYER_JUMP_ACK:
      return {
        ...state,
        jump: -1,
      }
    case ENABLE_KEYBORAD_CONTROLS:
      return {
        ...state,
        keyboardControls: true,
      }
    case DISABLE_KEYBORAD_CONTROLS:
      return {
        ...state,
        keyboardControls: false,
      }
    default:
      return state
  }
}

const createRootReducer = history => {
  return combineReducers({
    postsBySubreddit,
    selectedSubreddit,
    subreddits,
    config,
    router: connectRouter(history),
  })
}

export default createRootReducer
