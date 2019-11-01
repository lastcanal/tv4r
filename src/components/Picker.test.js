import { Provider } from 'react-redux'

import Picker from './Picker'

describe('picker', () => {
  it('should render Picker', () => {
    const onChange = jest.fn(() => {})
    const wrapper = shallow(
      <Provider store={makeStore()}>
        <Picker options={['foo', 'bar']} value={'foo'} />
      </Provider>
    )

    expect(wrapper).toMatchInlineSnapshot(`ShallowWrapper {}`)
  })
})
