import * as actions from './index.js'
import * as types from '../constants'
import * as helpers from '../helpers'
import fc from 'fast-check'

describe('actions', () => {

  it('should check request posts', () => {
    fc.assert(fc.property(fc.string(), (subreddit) => {
      const action = {
        type: types.SELECT_SUBREDDIT,
        subreddit
      }

      expect(actions.selectSubreddit(subreddit)).toEqual(action)
    }))
  })

  it('should invalidate subreddit', () => {
    fc.assert(fc.property(fc.string(), (subreddit) => {
      const action = {
        type: types.INVALIDATE_SUBREDDIT,
        subreddit
      }

      expect(actions.invalidateSubreddit(subreddit)).toEqual(action)
    }))
  })

  it('should requests posts', () => {
    fc.assert(fc.property(fc.string(), (subreddit) => {
      const action = {
        type: types.REQUEST_POSTS,
        subreddit
      }

      expect(actions.requestPosts(subreddit)).toEqual(action)
    }))
  })

  it('should not crash on arbitrary data via receive posts', () => {
    fc.assert(fc.property(fc.string(), fc.array(fc.object()), (subreddit, posts) => {
      const response = actions.receivePosts(subreddit, posts)
       expect(response.type).toEqual(types.RECEIVE_POSTS)
       expect(+(response.receivedAt)).toBeLessThanOrEqual(+(new Date()))
       expect(response.posts.length).toEqual(0)
    }))
  })

  const injectMedia = (key) => {
   return (data) => {
      data.secure_media = {
        oembed: {type: 'video'}
      }

      return {data}
    }
  }

  it('should receive secure media posts', () => {
    fc.assert(fc.property(fc.string(), fc.array(fc.object(), 100), (subreddit, objects) => {
       const posts = objects.map(injectMedia('secure_media'))
       const response = actions.receivePosts(subreddit, {data: {children: posts}})
       expect(response.type).toEqual(types.RECEIVE_POSTS)
       expect(+(response.receivedAt)).toBeLessThanOrEqual(+(new Date()))
       expect(response.posts.length).toEqual(posts.length)
    }))
  })

  it('should receive media posts', () => {
    fc.assert(fc.property(fc.string(), fc.array(fc.object(), 100), (subreddit, objects) => {
       const posts = objects.map(injectMedia('media'))
       const response = actions.receivePosts(subreddit, {data: {children: posts}})
       expect(response.type).toEqual(types.RECEIVE_POSTS)
       expect(+(response.receivedAt)).toBeLessThanOrEqual(+(new Date()))
       expect(response.posts.length).toEqual(posts.length)
    }))
  })

  it('should receive image posts', () => {
    fc.assert(fc.property(fc.string(), fc.array(fc.object(), 100), (subreddit, objects) => {
       const posts = objects.map(injectMedia('media'))
       const response = actions.receivePosts(subreddit, {data: {children: posts}}, types.MEDIA_IMAGE)
       expect(response.type).toEqual(types.RECEIVE_POSTS)
       expect(+(response.receivedAt)).toBeLessThanOrEqual(+(new Date()))
       expect(response.posts.length).toEqual(posts.length)
    }))
  })

  describe('fetching subreddit', () => {
    it('should fetch posts if needed', () => {
        fetch.resetMocks()
        fc.assert(fc.property(fc.string(), fc.array(fc.object(), 100), (subreddit, objects) => {
          fetch.mockResponseOnce(JSON.stringify(objects))
          const dispatch = jest.fn(() => {})
          const getState = jest.fn(() => {
            return {postsBySubreddit: {}}
          })
          actions.fetchPostsIfNeeded(subreddit)(dispatch, getState)
          expect(getState).toHaveBeenCalled()
          expect(dispatch).toHaveBeenCalled()
      }))
    })

    it('should not fetch posts if cached', () => {
        fetch.resetMocks()
        fc.assert(fc.property(fc.string(), fc.array(fc.object(), 100), (subreddit, objects) => {
          fetch.mockResponseOnce(JSON.stringify(objects))
          const dispatch = jest.fn(() => {})
          const getState = jest.fn(() => {
            const state = {postsBySubreddit: {}}
            state.postsBySubreddit[subreddit] = {items: objects, isFetching: false, didInvalidate: false}
            return state
          })
          actions.fetchPostsIfNeeded(subreddit)(dispatch, getState)
          expect(getState).toHaveBeenCalled()
          expect(dispatch).not.toHaveBeenCalled()
      }))
    })

    it('should not fetch posts if currently fetching posts', () => {
        fetch.resetMocks()
        fc.assert(fc.property(fc.string(), fc.array(fc.object(), 100), (subreddit, objects) => {
          fetch.mockResponseOnce(JSON.stringify(objects))
          const dispatch = jest.fn(() => {})
          const getState = jest.fn(() => {
            const state = {postsBySubreddit: {}}
            state.postsBySubreddit[subreddit] = {items: [], isFetching: true, didInvalidate: false}
            return state
          })
          actions.fetchPostsIfNeeded(subreddit)(dispatch, getState)
          expect(getState).toHaveBeenCalled()
          expect(dispatch).not.toHaveBeenCalled()
      }))
    })
  })
})

