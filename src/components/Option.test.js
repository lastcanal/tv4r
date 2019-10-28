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

    expect(wrapper).toMatchInlineSnapshot(`ReactWrapper {}`)
    wrapper.find(RemoveCircleIcon).simulate('click')
    expect(wrapper).toMatchInlineSnapshot(`ReactWrapper {}`)
    wrapper.find(MenuItem).simulate('click')
    expect(wrapper).toMatchInlineSnapshot(`ReactWrapper {}`)
    expect(setValue).toHaveBeenCalledWith({ value })
  })
})
