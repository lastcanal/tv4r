import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import {
  LOCATION_CHANGE, CALL_HISTORY_METHOD
} from 'connected-react-router'

import {
  SELECT_SUBREDDIT, INVALIDATE_SUBREDDIT,
  REQUEST_POSTS, RECEIVE_POSTS, RECEIVE_POSTS_ERROR,
  SELECT_POST, NEXT_POST, PREVIOUS_POST, MEDIA_FALLBACK,
  DEFAULT_SUBREDDIT,
} from '../constants'

import {
  filterPosts, matchRedditPath, findPostById, extractPost,
  getNewSubredditFromPath, didInvalidateSubredditFromPath
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

const posts = (state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) => {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
      return {
        ...state,
        didInvalidate: true
      }
    case REQUEST_POSTS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false,
        error: null
      }
    case RECEIVE_POSTS:
      const items = filterPosts(action.posts)
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        items: items,
        lastUpdated: action.receivedAt
      }
    case RECEIVE_POSTS_ERROR:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        items: [],
        error: action.error
      }
    case LOCATION_CHANGE:
      const didInvalidate =
        didInvalidateSubredditFromPath(action.subreddit, action)

      return {
        ...state,
        didInvalidate,
        isFetching: false,
        items: state.items || [],
        error: null
      }

    default:
      /* istanbul ignore next */
      return state
  }
}

export const postsBySubreddit = (state = { }, action) => {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
    case REQUEST_POSTS:
    case RECEIVE_POSTS:
    case RECEIVE_POSTS_ERROR:
      return {
        ...state,
        [action.subreddit]: posts(state[action.subreddit], action)
      }
    case LOCATION_CHANGE:
      const subreddit = getNewSubredditFromPath(null, action)
      if (subreddit) {
        return {
          ...state,
          [subreddit]: posts((state[subreddit] || {}), { ...action, subreddit })
        }
      } else {
        return state
      }
    default:
      return state
  }
}

export const selectedPost = (state = { }, action) => {
  switch (action.type) {
    case RECEIVE_POSTS:
      return {
        ...state,
        ...extractPost(state, action),
        media_fallback: false
      }
    case SELECT_POST:
      return {
        ...state,
        ...extractPost(state, action),
        media_fallback: false
      }
    case NEXT_POST:
      const next_index = state.index + 1
      const next_post = action.posts[next_index]

      return {
        ...state,
        index: next_post ? next_index : 0,
        post: next_post ? next_post : action.posts[0],
        media_fallback: false
      }
    case PREVIOUS_POST:
      const previous_index = state.index - 1 >= 0 ?
        state.index - 1 : action.posts.length - 1
      return {
        ...state,
        index: previous_index,
        post: action.posts[previous_index],
        media_fallback: false
      }
    case MEDIA_FALLBACK:
      return {
        ...state,
        media_fallback: true
      }
    case LOCATION_CHANGE:
      const match = matchRedditPath(action.payload.location.pathname)
      if (match) {
        const { postId } = match.params
        if (!state.post || (postId !== state.post.id)) {
          return {
            ...state,
            post: {
              id: postId,
            }
          }
        } else {
          console.error('need posts for history change!', state, action)
        }
      }

      return state
    default:
      return state
  }
}

const createRootReducer = (history) => {
  return combineReducers({
    postsBySubreddit,
    selectedSubreddit,
    selectedPost,
    router: connectRouter(history)
  })
}

export default createRootReducer
