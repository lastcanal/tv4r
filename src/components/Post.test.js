import { Provider } from 'react-redux'

import Post from './Post'
import * as actions from '../actions'

describe('Post', () => {

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
      url: "https://example.com/video"
    }

    const store = mockStore({
      postsBySubreddit: {
        foo: {
          items: [ post ],
          isFetching: false,
          didInvalidate: false
        }
      },
      selectedSubreddit: 'foo',
      selectedPost: { post }
    })


    const wrapper = mount(
      <Provider store={store}>
        <Post />
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should render media fallback', () => {
    const post = {
      id: 1,
      url: "https://example.com/video",
      media: {
        oembed: {
          type: 'video'
        }
      },
      media_embed: {
        content: "&lt;iframe width=\"600\" height=\"338\" src=\"https://example.com/video\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen&gt;&lt;/iframe&gt;"
      }
    }

    const store = mockStore({
      postsBySubreddit: {
        foo: {
          items: [ post ],
          isFetching: false,
          didInvalidate: false
        }
      },
      selectedSubreddit: 'foo',
      selectedPost: { post, media_fallback: true }
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
      url: "https://example.com/video",
      media: {
        oembed: {
          type: 'image'
        }
      },
    }

    const store = mockStore({
      postsBySubreddit: {
        foo: {
          items: [ post ],
          isFetching: false,
          didInvalidate: false
        }
      },
      selectedSubreddit: 'foo',
      selectedPost: { post, media_fallback: true }
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
          items: [  ],
          isFetching: true,
          didInvalidate: false
        }
      },
      selectedSubreddit: 'foo',
      selectedPost: {  }
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
      url: "https://example.com/video",
    }

    const post2 = {
      id: 2,
      url: "https://example.com/video2",
    }

    const store = mockStore({
      postsBySubreddit: {
        foo: {
          items: [ post1, post2 ],
          isFetching: false,
          didInvalidate: false
        }
      },
      selectedSubreddit: 'foo',
      selectedPost: { post: post1 }
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
      url: "https://example.com/video",
    }

    const store = mockStore({
      postsBySubreddit: {
        foo: {
          items: [ post ],
          isFetching: true,
          didInvalidate: true
        }
      },
      selectedSubreddit: 'foo',
      selectedPost: { post }
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
