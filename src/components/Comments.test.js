import { Provider } from 'react-redux'

import Comments from './Comments'
import * as fixtures from '../testFixtures'

describe('comments', () => {
  it('should render empty Comments', () => {
    const wrapper = mount(
      <Provider
        store={makeStore({
          postsBySubreddit: {
            foo: {
              items: [],
              comments: {},
              isFetching: false,
              didInvalidate: false,
            },
            cursor: { index: 0 },
          },
          selectedSubreddit: 'foo',
        })}
      >
        <Comments />
      </Provider>
    )

    expect(wrapper).toMatchInlineSnapshot(`ReactWrapper {}`)
  })

  it('should render Post', () => {
    const post = {id: "foo", url: 'https://example.com/foo'}
    const store = mockStore({
      postsBySubreddit: {
        foo: {
          items: [post],
          comments: {
            foo: {
              root: fixtures.postComments('bar'),
              bar: fixtures.postComments('baz'),
            },
          },
          isFetching: false,
          didInvalidate: false,
        },
        cursor: { post, index: 0 },
      },
      selectedSubreddit: 'foo',
    })

    const wrapper = mount(
      <Provider store={store}>
        <Comments />
      </Provider>
    )

    expect(wrapper).toMatchInlineSnapshot(`ReactWrapper {}`)
  })
})
