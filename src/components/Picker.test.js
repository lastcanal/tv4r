import Picker from './Picker'

describe('picker', () => {
  it('should render Picker', () => {
    const onChange = jest.fn(() => {})
    const wrapper = shallow(
      <Picker options={['foo', 'bar']} value={'foo'} onChange={onChange} />
    )

    expect(wrapper).toMatchInlineSnapshot(`ShallowWrapper {}`)
  })
})
