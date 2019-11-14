import { Provider } from 'react-redux'
import { flushSync } from 'react-dom'

import Post from './Post'
import * as actions from '../actions'

describe('post', () => {
  it('should render empty Post', () => {
    const wrapper = mount(
      <Provider store={makeStore()}>
        <Post />
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should render Post', () => {
    const post = {
      id: 1,
      url: 'https://example.com/',
    }

    const store = mockStore({
      postsBySubreddit: {
        foo: {
          scope: 'hot',
          hot: [post],
          isFetching: false,
          didInvalidate: false,
        },
        cursor: { post },
      },
      selectedSubreddit: 'foo',
    })

    const wrapper = mount(
      <Provider store={store}>
        <Post />
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should render Video', () => {
    jest.useFakeTimers()

    const post = {
      id: 1,
      url: 'https://www.youtube.com/watch?v=oUFJJNQGwhk',
      is_video: true,
    }

    const store = mockStore({
      postsBySubreddit: {
        foo: {
          scope: 'hot',
          hot: [post],
          isFetching: false,
          didInvalidate: false,
        },
        cursor: { post },
      },
      selectedSubreddit: 'foo',
    })

    const wrapper = mount(
      <Provider store={store}>
        <Post />
      </Provider>
    )

    act(() => {
      jest.advanceTimersByTime(100)
    })

    expect(wrapper).toMatchSnapshot()
  })

  it('should render Image', () => {
    const post = {
      id: 1,
      url: 'https://example.com/example.jpg',
      preview: {
        enabled: true,
        thumbnail: 'https://example.com/example.jpg',
        images: [
          {
            resolutions: [
              { url: 'https://example.com/example.jpg' },
            ],
          },
        ],
      },
    }

    const store = mockStore({
      postsBySubreddit: {
        foo: {
          scope: 'hot',
          hot: [post],
          isFetching: false,
          didInvalidate: false,
        },
        cursor: { post },
      },
      selectedSubreddit: 'foo',
    })

    const wrapper = mount(
      <Provider store={store}>
        <Post />
      </Provider>
    )

    flushSync(() => expect(wrapper).toMatchSnapshot())
  })


  it('should render media fallback', () => {
    const post = {
      id: 1,
      url: 'https://example.com/video',
      media: {
        oembed: {
          type: 'video',
        },
      },
      media_embed: {
        content:
          '&lt;iframe width="600" height="338" src="https://example.com/video" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen&gt;&lt;/iframe&gt;',
      },
    }

    const store = mockStore({
      postsBySubreddit: {
        foo: {
          scope: 'hot',
          hot: [post],
          isFetching: false,
          didInvalidate: false,
        },
        cursor: { post, media_fallback: true },
      },
      selectedSubreddit: 'foo',
    })

    const wrapper = mount(
      <Provider store={store}>
        <Post />
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should not render media fallback for non-videos', () => {
    const post = {
      id: 1,
      url: 'https://example.com/video',
      media: {
        oembed: {
          type: 'image',
        },
      },
    }

    const store = mockStore({
      postsBySubreddit: {
        foo: {
          scope: 'hot',
          hot: [post],
          isFetching: false,
          didInvalidate: false,
        },
        cursor: { post, media_fallback: true },
      },
      selectedSubreddit: 'foo',
    })

    const wrapper = mount(
      <Provider store={store}>
        <Post />
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should render Post is loading', () => {
    const store = mockStore({
      postsBySubreddit: {
        foo: {
          scope: 'hot',
          hot: [],
          isFetching: true,
          didInvalidate: false,
        },
        cursor: {},
      },
      selectedSubreddit: 'foo',
    })

    const wrapper = mount(
      <Provider store={store}>
        <Post />
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should render next post', () => {
    const post1 = {
      id: 1,
      url: 'https://example.com/video',
    }

    const post2 = {
      id: 2,
      url: 'https://example.com/video2',
    }

    const store = mockStore({
      postsBySubreddit: {
        foo: {
          scope: 'hot',
          hot: [post1, post2],
          isFetching: false,
          didInvalidate: false,
        },
        cursor: { post: post1 },
      },
      selectedSubreddit: 'foo',
    })

    const wrapper = mount(
      <Provider store={store}>
        <Post />
      </Provider>
    )

    store.dispatch(actions.nextPost())
    expect(wrapper).toMatchSnapshot()
  })

  it('should show loading when isFetching', () => {
    const post = {
      id: 1,
      url: 'https://example.com/video',
    }

    const store = mockStore({
      postsBySubreddit: {
        foo: {
          scope: 'hot',
          hot: [post],
          isFetching: true,
          didInvalidate: true,
        },
        cursor: { post },
      },
      selectedSubreddit: 'foo',
    })

    const wrapper = mount(
      <Provider store={store}>
        <Post />
      </Provider>
    )

    store.dispatch(actions.nextPost())
    expect(wrapper).toMatchSnapshot()
  })
})
