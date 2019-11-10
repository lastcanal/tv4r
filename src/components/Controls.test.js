import { Provider } from 'react-redux'

import SkipNextIcon from '@material-ui/icons/SkipNext'
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious'
import RefreshIcon from '@material-ui/icons/Refresh'

import Controls from './Controls'
import * as actions from '../actions'

describe('controls', () => {
  const posts = [{ id: 1 }, { id: 2 }]

  it('should render Controls', () => {
    const wrapper = mount(
      <Provider store={makeStore()}>
        <Controls />
      </Provider>
    )

    expect(wrapper).toMatchInlineSnapshot(`ReactWrapper {}`)
  })

  it('should render handle next post', () => {
    const dispatch = jest.fn(() => {})
    const store = {
      ...makeStore({
        selectdSubreddit: 'foo',
        postsBySubreddit: {
          foo: {
            scope: 'hot',
            hot: posts,
          },
        },
      }),
      dispatch,
    }
    const wrapper = mount(
      <Provider store={store}>
        <Controls />
      </Provider>
    )

    wrapper.find(SkipNextIcon).simulate('click')

    expect(dispatch).toHaveBeenCalled()
  })

  it('should render handle previous post', () => {
    const dispatch = jest.fn(() => {})
    const store = {
      ...makeStore({
        selectdSubreddit: 'foo',
        postsBySubreddit: {
          foo: {
            scope: 'hot',
            hot: posts,
          },
        },
      }),
      dispatch,
    }
    const wrapper = mount(
      <Provider store={store}>
        <Controls />
      </Provider>
    )

    wrapper.find(SkipPreviousIcon).simulate('click')

    expect(dispatch).toHaveBeenCalled()
  })

  it('should render handle refresh', () => {
    const dispatch = jest.fn(() => {})
    const store = {
      ...makeStore(),
      dispatch,
    }
    const subreddit = 'foo'
    const wrapper = mount(
      <Provider store={store}>
        <Controls />
      </Provider>
    )

    wrapper.find(RefreshIcon).simulate('click')

    expect(dispatch).toHaveBeenCalled()
  })
})
