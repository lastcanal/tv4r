import Picker from './Picker'

describe('Picker', () => {
  it('should render Picker', () => {
    const onChange = jest.fn(() => {})
    const wrapper = shallow(
      <Picker options={['foo', 'bar']} value={'foo'} onChange={onChange} />,
    )

    expect(wrapper).toMatchSnapshot()
  })
})
