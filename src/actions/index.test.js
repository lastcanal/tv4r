import * as actions from './index.js'
import * as types from '../constants'
import fc from 'fast-check'

describe('actions', () => {
  it('should check request posts', () => {
    fc.assert(
      fc.property(fc.string(), subreddit => {
        const action = {
          type: types.SELECT_SUBREDDIT,
          subreddit,
        }

        expect(actions.selectSubreddit(subreddit)).toStrictEqual(action)
      }),
    )
  })

  it('should invalidate subreddit', () => {
    fc.assert(
      fc.property(fc.string(), subreddit => {
        const action = {
          type: types.INVALIDATE_SUBREDDIT,
          subreddit,
        }

        expect(actions.invalidateSubreddit(subreddit)).toStrictEqual(action)
      }),
    )
  })

  it('should requests posts', () => {
    fc.assert(
      fc.property(fc.string(), subreddit => {
        const action = {
          type: types.REQUEST_POSTS,
          subreddit,
          scope: 'hot',
        }

        expect(actions.requestPosts(subreddit)).toStrictEqual(action)
      }),
    )
  })


  describe('fetching subreddit', () => {
    it('should fetch posts if needed', () => {
      fetch.resetMocks()
      fc.assert(
        fc.property(
          fc.string(),
          fc.array(fc.object(), 100),
          (subreddit, objects) => {
            fetch.mockResponseOnce(JSON.stringify(objects))
            const getState = jest.fn(() => {
              return { postsBySubreddit: { [subreddit]: { scope: 'hot' } } }
            })
            const dispatch = jest.fn((fn) => {
              typeof (fn) === 'function' ? fn(dispatch, getState) : null
            })
            actions.fetchPostsIfNeeded(subreddit)(dispatch, getState)
            expect(getState).toHaveBeenCalled()
            expect(dispatch).toHaveBeenCalled()
          },
        ),
      )
    })

    it('should not fetch posts if cached', () => {
      fetch.resetMocks()
      fc.assert(
        fc.property(
          fc.string(),
          fc.array(fc.object(), 100),
          (subreddit, objects) => {
            fetch.mockResponseOnce(JSON.stringify(objects))
            const dispatch = jest.fn((fn) => {
              typeof (fn) === 'function' ? fn(dispatch) : null
            })
            const getState = jest.fn(() => {
              const state = { postsBySubreddit: {} }
              state.postsBySubreddit[subreddit] = {
                scope: 'hot',
                hot: objects,
                isFetching: false,
                didInvalidate: false,
              }
              return state
            })
            actions.fetchPostsIfNeeded(subreddit)(dispatch, getState)
            expect(getState).toHaveBeenCalled()
            expect(dispatch).not.toHaveBeenCalled()
          },
        ),
      )
    })

    it('should not fetch posts if currently fetching posts', () => {
      fetch.resetMocks()
      fc.assert(
        fc.property(
          fc.string(),
          fc.array(fc.object(), 100),
          (subreddit, objects) => {
            fetch.mockResponseOnce(JSON.stringify(objects))
            const dispatch = jest.fn((fn) => {
              typeof (fn) === 'function' ? fn(dispatch) : null
            })
            const getState = jest.fn(() => {
              const state = { postsBySubreddit: {} }
              state.postsBySubreddit[subreddit] = {
                scope: 'hot',
                hot: [],
                isFetching: true,
                didInvalidate: false,
              }
              return state
            })
            actions.fetchPostsIfNeeded(subreddit)(dispatch, getState)
            expect(getState).toHaveBeenCalled()
            expect(dispatch).not.toHaveBeenCalled()
          },
        ),
      )
    })
  })

  describe('Comments', () => {
    const state = (post, index = 0) => ({
      postsBySubreddit: {
        foo: {
          scope: 'hot',
          hot: [post],
        },
        cursor: {
          index,
        },
      },
      selectedSubreddit: 'foo',
      config: {}
    })

    it('should check request post', () => {
      fetch.resetMocks()
      fc.assert(
        fc.property(
          fc.string(),
          fc.string(),
          fc.string(),
          fc.array(fc.object(), 10),
          (subreddit, id, permalink, objects) => {
            fetch.mockResponseOnce(JSON.stringify(objects))
            const post = { id: id, permalink }
            const dispatch = jest.fn((fn) => {
              typeof (fn) === 'function' ? fn(dispatch, () => state) : null
            })
            const getState = jest.fn(() => state(post))
            actions.fetchCommentsIfNeeded(post, subreddit)(dispatch, getState)
            expect(getState).toHaveBeenCalled()
            expect(dispatch).toHaveBeenCalled()
          },
        ),
      )
    })

    it('should handle request post errors', () => {
      fetch.resetMocks()
      fc.assert(
        fc.property(
          fc.string(),
          fc.string(),
          fc.string(),
          fc.array(fc.object(), 10),
          (subreddit, id, permalink, objects) => {
            fetch.mockResponseOnce('undefined')
            const post = { id: id, permalink }
            const dispatch = jest.fn((fn) => {
              typeof (fn) === 'function' ? fn(dispatch) : null
            })
            const getState = jest.fn(() => state(post))
            actions.fetchCommentsIfNeeded(post, subreddit)(dispatch, getState)
            expect(getState).toHaveBeenCalled()
            expect(dispatch).toHaveBeenCalled()
          },
        ),
      )
    })
  })

})
