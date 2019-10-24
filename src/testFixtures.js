
export const postWithComments = () => ({
  id: 1,
  url: 'https://example.com/video',
  comments: [
    {
      kind: 'Listing',
      data: {
        children: [
          {
            kind: 't3',
            data: {
              title: 'foo',
            },
          },
        ],
      },
    },
    {
      kind: 'Listing',
      data: {
        children: [
          {
            kind: 't1',
            data: {
              body: 'bar',
              replies: {
                kind: 'Listing',
                data: {
                  children: [
                    {
                      kind: 't2',
                      data: {
                        body: 'baz',
                      },
                    },
                    {
                      kind: 'more',
                      data: 'AAAAAAA',
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
  ],
})
