import reddit from './reddit'

describe('reddit', () => {
  it('can fetch posts', () => {
    fc.assert(
      fc.property(fc.array(fc.object(), 10), objects => {
        fetch.resetMocks()
        fetch.mockResponseOnce(JSON.stringify({ data: { children: objects } }))
        reddit.fetchPosts({ subreddit: 'foo', scope: 'hot' })

        expect(fetch.mock.calls[0][0]).toStrictEqual(
          encodeURI('https://www.reddit.com/r/foo/hot.json?limit=100'),
        )
      }),
    )
  })

  it('can fetch post', () => {
    fc.assert(
      fc.property(fc.array(fc.object(), 10), objects => {
        fetch.resetMocks()
        fetch.mockResponseOnce(JSON.stringify({ data: { children: objects } }))
        reddit.fetchPost({ permalink: '/r/foo/bla' })

        expect(fetch.mock.calls[0][0]).toStrictEqual(
          encodeURI('https://www.reddit.com/r/foo/bla.json'),
        )
      }),
    )
  })

  it('can fetch replies', () => {
    fc.assert(
      fc.property(fc.array(fc.object(), 10), objects => {
        fetch.resetMocks()
        fetch.mockResponseOnce(JSON.stringify({ data: { children: objects } }))
        reddit.fetchReplies({ subreddit: 'foo', permalink: '/r/foo/comments/123/bla'}, '456')

        expect(fetch.mock.calls[0][0]).toStrictEqual(
          encodeURI('https://www.reddit.com/r/foo/comments/123/bla/456.json'),
        )
      }),
    )
  })

})
