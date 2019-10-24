import reddit from './reddit'

describe('reddit', () => {
  it('can fetch posts', () => {
    fc.assert(
      fc.property(fc.array(fc.object(), 10), objects => {
        fetch.resetMocks()
        fetch.mockResponseOnce(JSON.stringify({ data: { children: objects } }))
        reddit.fetchPosts('foo')

        expect(fetch.mock.calls[0][0]).toStrictEqual(
          'https://www.reddit.com/r/foo.json?limit=1000',
        )
      }),
    )
  })

  it('can fetch post', () => {
    fc.assert(
      fc.property(fc.array(fc.object(), 10), objects => {
        fetch.resetMocks()
        fetch.mockResponseOnce(JSON.stringify({ data: { children: objects } }))
        reddit.fetchPost('/r/foo/bla')

        expect(fetch.mock.calls[0][0]).toStrictEqual(
          'https://www.reddit.com/r/foo/bla.json',
        )
      }),
    )
  })
})
