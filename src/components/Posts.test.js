import GridListTile from '@material-ui/core/GridListTile'
import { Provider } from 'react-redux'

import Posts from './Posts'
import * as actions from '../actions'

describe('posts', () => {
  const posts = [{ id: 1 }, { id: 2 }]

  it('should render empty Posts', () => {
    const wrapper = mount(
      <Provider store={makeStore()}>
        <Posts />
      </Provider>
    )

    expect(wrapper).toMatchInlineSnapshot(`ReactWrapper {}`)
  })

  it('should render Posts', () => {
    const store = mockStore({
      postsBySubreddit: {
        foo: {
          items: posts,
          isFetching: false,
          didInvalidate: false,
        },
      },
      selectedSubreddit: 'foo',
      selectedPost: { post: posts[0] },
    })

    const wrapper = mount(
      <Provider store={store}>
        <Posts />
      </Provider>
    )

    expect(wrapper).toMatchInlineSnapshot(`ReactWrapper {}`)
  })

  it('should navigate Posts', () => {
    const dispatch = jest.fn(() => {})
    const store = mockStore({
      postsBySubreddit: {
        foo: {
          items: posts,
          isFetching: false,
          didInvalidate: false,
        },
      },
      selectedSubreddit: 'foo',
      selectedPost: { post: posts[0] },
    })

    const wrapper = mount(
      <Provider store={{ ...store, dispatch }}>
        <Posts />
      </Provider>
    )

    wrapper
      .find(GridListTile)
      .last()
      .simulate('click')
    wrapper.update()

    expect(dispatch).toHaveBeenCalledWith(actions.selectPost(posts[1], 1))
    expect(wrapper).toMatchInlineSnapshot(`ReactWrapper {}`)
  })
})
