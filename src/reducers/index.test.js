import rootReducer from './index.js'
import * as types from '../constants'
import { LOCATION_CHANGE } from 'connected-react-router'

import { history } from '../configureStore'

describe('reducers', () => {
  const root = rootReducer(history)

  it('should SELECT_SUBREDDIT', () => {
    fc.assert(
      fc.property(fc.string(), subreddit => {
        const action = {
          type: types.SELECT_SUBREDDIT,
          subreddit,
        }

        expect(root(undefined, action)).toMatchObject({
          selectedSubreddit: subreddit,
        })
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

        const state = { subreddits: [] }
        const response = root(state, action)
        expect(response.postsBySubreddit[subreddit].didInvalidate).toBeTruthy()
        expect(response.subreddits[0]).toBe(subreddit)
      }),
    )
  })

  it('should remove subreddit', () => {
    fc.assert(
      fc.property(fc.string(), subreddit => {
        const addAction = {
          type: types.INVALIDATE_SUBREDDIT,
          subreddit,
        }

        const removeAction = {
          type: types.REMOVE_SUBREDDIT,
          subreddit,
        }

        const state = { subreddits: [] }
        const addResponse = root(state, addAction)
        expect(addResponse.postsBySubreddit[subreddit].didInvalidate).toBeTruthy()
        expect(addResponse.subreddits[0]).toBe(subreddit)
        const removeResponse = root(state, removeAction)
        expect(removeResponse.subreddits[0]).toBe(undefined)
      }),
    )
  })


  it('should request posts for subreddit', () => {
    fc.assert(
      fc.property(fc.string(), subreddit => {
        const action = {
          type: types.REQUEST_POSTS,
          subreddit,
        }

        const response = root(undefined, action)
        expect(response.postsBySubreddit[subreddit].isFetching).toBeTruthy()
        expect(response.postsBySubreddit[subreddit].didInvalidate).toBeFalsy()
      }),
    )
  })

  const injectMedia = key => {
    return data => {
      data[key] = {
        oembed: { type: 'video' },
      }

      return { data }
    }
  }

  it('should receives for subreddit', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.array(fc.object(), 100),
        (subreddit, objects) => {
          const action = {
            type: types.RECEIVE_POSTS,
            posts: objects.map(injectMedia('secure_media')),
            subreddit,
          }

          const response = root(undefined, action)
          expect(response.postsBySubreddit[subreddit].isFetching).toBeFalsy()
          expect(response.postsBySubreddit[subreddit].didInvalidate).toBeFalsy()
        },
      ),
    )
  })

  it('should select post', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.array(fc.object(), 100),
        fc.integer(0, 99),
        (subreddit, objects, index) => {
          const setupAction = {
            type: types.RECEIVE_POSTS,
            posts: objects.map(injectMedia('secure_media')),
            subreddit,
          }

          const post = setupAction.posts[index]

          const action = {
            type: types.SELECT_POST,
            index,
            post,
          }

          root(undefined, setupAction)
          const response = root(undefined, action)
          if (post) {
            expect(response.postsBySubreddit.cursor.post).toMatchObject(post)
          }
          expect(response.postsBySubreddit.cursor.index).toStrictEqual(index)
        },
      ),
    )
  })

  it('should receive errors for fetch posts from subreddit', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (subreddit, error) => {
        const action = {
          type: types.RECEIVE_POSTS_ERROR,
          subreddit,
          error,
        }

        const response = root(undefined, action)
        expect(response.postsBySubreddit[subreddit].error).toBe(error)
      }),
    )
  })

  it('should select next and previous post', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.array(fc.object(), 100),
        fc.integer(0, 99),
        (subreddit, objects, index) => {
          const posts = objects.map(injectMedia('secure_media'))
          const post = posts[index]

          if (!post) return null

          const setupAction = {
            type: types.RECEIVE_POSTS,
            posts,
            subreddit,
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
            posts,
          }
          const nextResponse = root(undefined, nextAction)
          expect(nextResponse.postsBySubreddit.cursor.post).not.toBeNull()

          const prevAction = {
            type: types.PREVIOUS_POST,
            posts,
          }
          var prevResponse = root(undefined, prevAction)
          expect(prevResponse.postsBySubreddit.cursor.post).not.toBeNull()

          prevResponse = root(undefined, prevAction)
          expect(prevResponse.postsBySubreddit.cursor.post).not.toBeNull()
          expect(prevResponse.postsBySubreddit.cursor.post).not.toBe(
            nextResponse.postsBySubreddit.cursor.post,
          )
        },
      ),
    )
  })

  it('should set media fallback', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.array(fc.object(), 100),
        fc.integer(0, 99),
        (subreddit, objects, index) => {
          const setupAction = {
            type: types.RECEIVE_POSTS,
            posts: objects.map(injectMedia('secure_media')),
            subreddit,
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
            type: types.MEDIA_FALLBACK,
          }

          expect(
            root(undefined, action).postsBySubreddit.cursor.media_fallback,
          ).toBeTruthy()
        },
      ),
    )
  })

  it('should toggle fullscreen', () => {
    const action = {
      type: types.TOGGLE_FULLSCREEN,
    }

    expect(root({ config: { isFullscreen: false } }, action).config.isFullscreen).toBe(true)
    expect(root({ config: { isFullscreen: true } }, action).config.isFullscreen).toBe(false)
  })

  it('should enable fullscreen', () => {
    const action = {
      type: types.ENABLE_FULLSCREEN,
    }

    expect(root({ config: { isFullscreen: false } }, action).config.isFullscreen).toBe(true)
  })

  it('should disable fullscreen', () => {
    const action = {
      type: types.DISABLE_FULLSCREEN,
    }

    expect(root({ config: { isFullscreen: true } }, action).config.isFullscreen).toBe(false)
  })

  it('should toggle autoplay', () => {
    const action = {
      type: types.TOGGLE_AUTO_ADVANCE,
    }

    expect(root({ config: { isAutoAdvance: false } }, action).config.isAutoAdvance).toBe(true)
    expect(root({ config: { isAutoAdvance: true } }, action).config.isAutoAdvance).toBe(false)
  })

  it('should set theme mode', () => {
    const action = {
      type: types.TOGGLE_THEME_MODE,
    }

    expect(root({ config: { themeMode: 'dark' } }, action).config.themeMode).toBe('light')
    expect(root({ config: { themeMode: 'light' } }, action).config.themeMode).toBe('dark')
  })

  it('should hangle location change for subreddit', () => {
    const action = {
      type: LOCATION_CHANGE,
      payload: {
        location: {
          pathname: '/r/videos',
        },
      },
    }

    expect(root(undefined, action).postsBySubreddit.cursor.post.id).toBe(undefined)
  })

  it('should hangle location change for post', () => {
    const action = {
      type: LOCATION_CHANGE,
      payload: {
        location: {
          pathname: '/r/videos/comments/foo/slug',
        },
      },
    }

    expect(root(undefined, action).postsBySubreddit.cursor.post.id).toBe('foo')
  })

  it('should hangle location change 404', () => {
    const action = {
      type: LOCATION_CHANGE,
      payload: {
        location: {
          pathname: 'blabla',
        },
      },
    }

    expect(root(undefined, action).postsBySubreddit.cursor.post).toBe(undefined)
  })

})
