import { Provider } from 'react-redux'

import Post from './Post'
import * as actions from '../actions'

describe('post', () => {
  it('should render empty Post', () => {
    const wrapper = mount(
      <Provider store={makeStore()}>
        <Post />
      </Provider>
    )

    expect(wrapper).toMatchInlineSnapshot(`ReactWrapper {}`)
  })

  it('should render Post', () => {
    const post = {
      id: 1,
      url: 'https://example.com/video',
    }

    const store = mockStore({
      postsBySubreddit: {
        foo: {
          items: [post],
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

    expect(wrapper).toMatchInlineSnapshot(`ReactWrapper {}`)
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
          items: [post],
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

    expect(wrapper).toMatchInlineSnapshot(`ReactWrapper {}`)
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
          items: [post],
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

    expect(wrapper).toMatchInlineSnapshot(`ReactWrapper {}`)
  })

  it('should render Post is loading', () => {
    const store = mockStore({
      postsBySubreddit: {
        foo: {
          items: [],
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

    expect(wrapper).toMatchInlineSnapshot(`ReactWrapper {}`)
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
          items: [post1, post2],
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
    expect(wrapper).toMatchInlineSnapshot(`ReactWrapper {}`)
  })

  it('should show loading when isFetching', () => {
    const post = {
      id: 1,
      url: 'https://example.com/video',
    }

    const store = mockStore({
      postsBySubreddit: {
        foo: {
          items: [post],
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
    expect(wrapper).toMatchInlineSnapshot(`ReactWrapper {}`)
  })
})
