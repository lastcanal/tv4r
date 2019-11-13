import { Provider } from 'react-redux'

import Menu from './Menu'

describe('menu', () => {
  it('should render empty menu', () => {
    const wrapper = mount(
      <Provider store={makeStore()}>
        <Menu />
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()
  })
})

test('should render new subreddit', () => {
  const store = makeStore({
    postsBySubreddit: {
      foo: {
        scope: 'hot',
        hot: [],
        isFetching: false,
        didInvalidate: false,
      },
      bar: {
        scope: 'hot',
        hot: [],
        isFetching: false,
        didInvalidate: false,
      },
    },
    selectedSubreddit: 'foo',
    selectedPost: { post: {} },
  })

  const wrapper = mount(
    <Provider store={store}>
      <Menu />
    </Provider>
  )

  wrapper.setProps({ selectedSubreddit: 'bar' })

  wrapper.update()

  expect(wrapper).toMatchSnapshot()
})
