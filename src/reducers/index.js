import { combineReducers } from 'redux'
import {
  SELECT_SUBREDDIT, INVALIDATE_SUBREDDIT,
  REQUEST_POSTS, RECEIVE_POSTS, RECEIVE_POSTS_ERROR,
  SELECT_POST, NEXT_POST, PREVIOUS_POST, MEDIA_FALLBACK,
  DEFAULT_SUBREDDIT,
} from '../constants'

import { filterPosts } from '../helpers'

export const selectedSubreddit = (state = DEFAULT_SUBREDDIT, action) => {
  switch (action.type) {
    case SELECT_SUBREDDIT:
      return action.subreddit
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
    default:
      return state
  }
}

export const selectedPost = (state = { }, action) => {
  switch (action.type) {
    case RECEIVE_POSTS:
      return {
        ...state,
        index: 0,
        post: action.posts[0],
        media_fallback: false
      }
    case SELECT_POST:
      return {
        ...state,
        index: action.index,
        post: action.post,
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
    default:
      return state
  }
}

const rootReducer = combineReducers({
  postsBySubreddit,
  selectedSubreddit,
  selectedPost
})

export default rootReducer
