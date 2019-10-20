import rootReducer from './index.js'
import * as types from '../constants'
import * as helpers from '../helpers'

import { history } from '../configureStore'

describe('reducers', () => {
  const root = rootReducer(history)

  it('should SELECT_SUBREDDIT', () => {
    fc.assert(fc.property(fc.string(), (subreddit) => {
      const action = {
        type: types.SELECT_SUBREDDIT,
        subreddit
      }

      expect(root(undefined, action)).toMatchObject({selectedSubreddit: subreddit});
    }))
  })

  it('should invalidate subreddit', () => {
    fc.assert(fc.property(fc.string(), (subreddit) => {
      const action = {
        type: types.INVALIDATE_SUBREDDIT,
        subreddit
      }

      const response = root(undefined, action)
      expect(response.postsBySubreddit[subreddit].didInvalidate).toBeTruthy();
    }))
  })

  it('should request posts for subreddit', () => {
    fc.assert(fc.property(fc.string(), (subreddit) => {
      const action = {
        type: types.REQUEST_POSTS,
        subreddit
      }

      const response = root(undefined, action)
      expect(response.postsBySubreddit[subreddit].isFetching).toBeTruthy();
      expect(response.postsBySubreddit[subreddit].didInvalidate).toBeFalsy();
    }))
  })


  const injectMedia = (key) => {
   return (data) => {
      data[key] = {
        oembed: {type: 'video'}
      }

      return {data}
    }
  }

  it('should receives for subreddit', () => {
    fc.assert(fc.property(fc.string(), fc.array(fc.object(), 100), (subreddit, objects) => {
      const action = {
        type: types.RECEIVE_POSTS,
        posts: objects.map(injectMedia('secure_media')),
        subreddit
      }

      const response = root(undefined, action)
      expect(response.postsBySubreddit[subreddit].isFetching).toBeFalsy();
      expect(response.postsBySubreddit[subreddit].didInvalidate).toBeFalsy();
    }))
  })

  it('should select post', () => {
    fc.assert(fc.property(fc.string(), fc.array(fc.object(), 100), fc.integer(0, 99), (subreddit, objects, index) => {
      const setupAction = {
        type: types.RECEIVE_POSTS,
        posts: objects.map(injectMedia('secure_media')),
        subreddit
      }

      const post = setupAction.posts[index]

      const action = {
        type: types.SELECT_POST,
        index,
        post,
      }

      root(undefined, setupAction)
      const response = root(undefined, action)
      if (post) expect(response.selectedPost.post).toMatchObject(post);
      expect(response.selectedPost.index).toEqual(index);

    }))
  })

  it('should receive errors for fetch posts from subreddit', () => {
    fc.assert(fc.property(fc.string(), fc.string(), (subreddit, error) => {
      const action = {
        type: types.RECEIVE_POSTS_ERROR,
        subreddit,
        error
      }

      const response = root(undefined, action)
      expect(response.postsBySubreddit[subreddit].error).toBe(error);
    }))
  })

  it('should select next and previous post', () => {
    fc.assert(fc.property(fc.string(), fc.array(fc.object(), 100), fc.integer(0, 99), (subreddit, objects, index) => {
      const posts = objects.map(injectMedia('secure_media'))
      const post = posts[index]

      if (!post) return null

      const setupAction = {
        type: types.RECEIVE_POSTS,
        posts,
        subreddit
      }
      root(undefined, setupAction)

      const selectAction = {
        type: types.SELECT_POST,
        index,
        post: posts[index],
      }
      root(undefined, selectAction)

      const nextAction = {
        type: types.NEXT_POST,
        posts
      }
      const nextResponse = root(undefined, nextAction)
      expect(nextResponse.selectedPost.post).not.toBeNull();

      const prevAction = {
        type: types.PREVIOUS_POST,
        posts
      }
      var prevResponse = root(undefined, prevAction)
      expect(prevResponse.selectedPost.post).not.toBeNull();

      prevResponse = root(undefined, prevAction)
      expect(prevResponse.selectedPost.post).not.toBeNull();
      expect(prevResponse.selectedPost.post)
        .not.toBe(nextResponse.selectedPost.post);
    }))
  })

  it('should set media fallback', () => {
    fc.assert(fc.property(fc.string(), fc.array(fc.object(), 100), fc.integer(0, 99), (subreddit, objects, index) => {
      const setupAction = {
        type: types.RECEIVE_POSTS,
        posts: objects.map(injectMedia('secure_media')),
        subreddit
      }

      const post = setupAction.posts[index]

      const selectAction = {
        type: types.SELECT_POST,
        index,
        post,
      }

      root(undefined, setupAction)
      root(undefined, selectAction)

      const action = {
        type: types.MEDIA_FALLBACK
      }

      expect(root(undefined, action).selectedPost.media_fallback).toBeTruthy()
    }))
  })

  it('should ignore defaults', () => {
    fc.assert(fc.property(fc.string(), (type) => {
      const action = {
        type
      }

      expect((root(undefined, action)))
    }))
  })
})

