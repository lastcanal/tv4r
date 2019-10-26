import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'

import App from './App'

import { history } from './setupTests'

describe('app', () => {
  it('renders empty app', () => {
    fetch.mockResponseOnce(JSON.stringify({ data: { children: [] } }))
    const store = makeStore()
    mount(
      <Provider store={store}>
        <ConnectedRouter history={history} hashType="noslash">
          <App />
        </ConnectedRouter>
      </Provider>,
    )
  })

  it('renders error app', () => {
    fetch.mockResponseOnce('undefined')
    mount(
      <Provider store={makeStore()}>
        <ConnectedRouter history={history} hashType="noslash">
          <App />
        </ConnectedRouter>
      </Provider>,
    )
  })

  it('renders app with posts', () => {
    fetch.resetMocks()
    fc.assert(
      fc.property(fc.array(fc.object(), 10), objects => {
        fetch.mockResponseOnce(JSON.stringify({ data: { children: objects } }))
        mount(
          <Provider store={makeStore()}>
            <ConnectedRouter history={history} hashType="noslash">
              <App />
            </ConnectedRouter>
          </Provider>,
        )
      }),
    )
  })
})
