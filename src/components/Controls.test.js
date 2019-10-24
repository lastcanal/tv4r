import SkipNextIcon from '@material-ui/icons/SkipNext'
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious'
import RefreshIcon from '@material-ui/icons/Refresh'

import Controls from './Controls'
import * as actions from '../actions'

describe('Controls', () => {
  const posts = [{ id: 1 }, { id: 2 }]

  it('should render Controls', () => {
    const wrapper = mount(<Controls />)

    expect(wrapper).toMatchSnapshot()
  })

  it('should render handle next post', () => {
    const dispatch = jest.fn(() => {})
    const wrapper = mount(<Controls dispatch={dispatch} posts={posts} />)

    wrapper.find(SkipNextIcon).simulate('click')

    expect(dispatch).toBeCalledWith(actions.nextPost(posts))
  })

  it('should render handle previous post', () => {
    const dispatch = jest.fn(() => {})
    const wrapper = mount(<Controls dispatch={dispatch} posts={posts} />)

    wrapper.find(SkipPreviousIcon).simulate('click')

    expect(dispatch).toBeCalledWith(actions.previousPost(posts))
  })

  it('should render handle refresh', () => {
    const dispatch = jest.fn(() => {})
    const subreddit = 'foo'
    const wrapper = mount(
      <Controls dispatch={dispatch} selectedSubreddit={subreddit} />,
    )

    wrapper.find(RefreshIcon).simulate('click')

    expect(dispatch).toBeCalledWith(actions.invalidateSubreddit(subreddit))

    expect(dispatch).toBeCalledWith(actions.invalidateSubreddit(subreddit))
  })
})
