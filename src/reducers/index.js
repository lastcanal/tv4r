import { combineReducers } from 'redux'
import {
  SELECT_SUBREDDIT, INVALIDATE_SUBREDDIT,
  REQUEST_POSTS, RECEIVE_POSTS, SELECT_POST,
  DEFAULT_SUBREDDITS, NEXT_POST, PREVIOUS_POST
} from '../constants'

import { filterPosts } from '../helpers'

const selectedSubreddit = (state = DEFAULT_SUBREDDITS[0], action) => {
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
        didInvalidate: false
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
    default:
      return state
  }
}

const postsBySubreddit = (state = { }, action) => {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return {
        ...state,
        [action.subreddit]: posts(state[action.subreddit], action)
      }
    default:
      return state
  }
}

const selectedPost = (state = { }, action) => {
  switch (action.type) {
    case RECEIVE_POSTS:
      return action.posts[0]
    case SELECT_POST:
      return action.post
    case NEXT_POST:
      return state
    case PREVIOUS_POST:
      return state
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
