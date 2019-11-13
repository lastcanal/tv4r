import { Provider } from 'react-redux'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import { MenuItem } from '@material-ui/core'

import Option from './Option'

describe('Option', () => {
  it('should render Option', () => {
    const setValue = jest.fn(() => {})
    const value = 'foo'
    const wrapper = mount(
      <Provider store={makeStore()}>
        <Option setValue={setValue} data={{ value }}>Foo</Option>
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()
    wrapper.find(RemoveCircleIcon).simulate('click')
    expect(wrapper).toMatchSnapshot()
    wrapper.find(MenuItem).simulate('click')
    expect(wrapper).toMatchSnapshot()
    expect(setValue).toHaveBeenCalledWith({ value })
  })
})
