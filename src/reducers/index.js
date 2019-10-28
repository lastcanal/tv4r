import { combineReducers } from 'redux'
import { connectRouter, LOCATION_CHANGE } from 'connected-react-router'

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
  DEFAULT_SUBREDDIT,
  DEFAULT_SUBREDDITS,
  TOGGLE_FULLSCREEN,
  TOGGLE_AUTOPLAY,
  TOGGLE_THEME_MODE,
} from '../constants'

import {
  filterPosts,
  matchRedditPath,
  findPostById,
  extractPost,
  getNewSubredditFromPath,
  didInvalidateSubredditFromPath,
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
    items: [],
  },
  action,
) => {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
      return {
        ...state,
        didInvalidate: true,
      }
    case REQUEST_POSTS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false,
        error: null,
      }
    case RECEIVE_POSTS:
      const items = filterPosts(action.posts)
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        items: items,
        lastUpdated: action.receivedAt,
      }
    case RECEIVE_POSTS_ERROR:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        items: [],
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
        items: state.items || [],
        error: null,
      }
    case REQUEST_COMMENTS:
      return {
        ...state,
        isFetchingComments: true,
        error: null,
      }
    case RECEIVE_COMMENTS:
      const { index, post } = findPostById(action.post.id, state.items)
      const newState = {
        ...state,
        isFetchingComments: false,
        items: ([
          ...state.items.slice(0, index),
          { ...post, comments: action.comments },
          ...state.items.slice(index + 1),
        ]),
      }

      return newState
    case RECEIVE_COMMENTS_ERROR:
      return {
        ...state,
        isFetchingComments: false,
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
        return state
      }
    case INVALIDATE_SUBREDDIT:
      return {
        ...state,
        post: {id: state.post ? state.post.id : null},
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
      return {
        ...state,
        [action.subreddit]: selectedPosts(state[action.subreddit], action),
        cursor: selectedPost(state.cursor || {}, action),
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
      const posts = state[subreddit] ? state[subreddit].items : []
      if (subreddit) {
        return {
          ...state,
          [subreddit]: selectedPosts(state[subreddit] || {}, {
            ...action,
            posts,
            subreddit,
          }),
          cursor: selectedPost(state.cursor || {}, {
            ...action,
            posts,
            subreddit,
          }),
        }
      } else {
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

const config = (state = { isFullsceen: false, isAutoplay: false }, action) => {
  switch (action.type) {
    case TOGGLE_FULLSCREEN:
      return {
        ...state,
        isFullscreen: !state.isFullscreen,
      }
    case TOGGLE_AUTOPLAY:
      return {
        ...state,
        isAutoplay: !state.isAutoplay,
      }
    case TOGGLE_THEME_MODE:
      return {
        ...state,
        themeMode: state.themeMode === 'dark' ? 'light' : 'dark',
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
