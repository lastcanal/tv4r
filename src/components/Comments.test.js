import { Provider } from 'react-redux'

import Comments from './Comments'
import * as actions from '../actions'


describe('Comments', () => {
  it('should render empty Comments', () => {
    const wrapper = mount(
      <Provider store={
        makeStore({
          postsBySubreddit: {
            foo: {
              items: [],
              isFetching: false,
              didInvalidate: false,
            },
            cursor: { index: 0 },
          },
          selectedSubreddit: 'foo',
        }
        )}>
        <Comments />
      </Provider>,
    )

    expect(wrapper).toMatchSnapshot()
  })


  it('should render Post', () => {
    const post = {
      id: 1,
      url: 'https://example.com/video',
      comments: [{
        kind: 'Listing',
        data: {
          children: [{
            kind: 't3',
            data: {
              title: 'foo',
            },
          }],
        },
      }, {
        kind: 'Listing',
        data: {
          children: [{
            kind: 't1',
            data: {
              body: 'bar',
              replies: {
                kind: 'Listing',
                data: {
                  children: [{
                    kind: 't2',
                    data: {
                      body: 'baz',
                    },
                  }, {
                    kind: 'more',
                    data: 'AAAAAAA',
                  }],
                },
              },
            },
          }],
        },
      }],
    }

    const store = mockStore({
      postsBySubreddit: {
        foo: {
          items: [post],
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
      </Provider>,
    )

    expect(wrapper).toMatchSnapshot()
  })
})
