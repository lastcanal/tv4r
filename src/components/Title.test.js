import Title from './Title'

describe('Title', () => {

  it('should render Title', () => {
    const enzymeWrapper = mount(
      <Title post={{title: "hello"}} />
    );

    expect(enzymeWrapper).toMatchSnapshot()
  })

  it('should render without title', () => {
    const enzymeWrapper = mount(
      <Title post={{title: undefined}} />
    );

    expect(enzymeWrapper).toMatchSnapshot()
  })

  it('should render without post', () => {
    const enzymeWrapper = mount(
      <Title post={undefined} />
    );

    expect(enzymeWrapper).toMatchSnapshot()
  })

})
