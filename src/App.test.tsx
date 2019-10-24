import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Route } from 'react-router'

import App from './App'

import configureStore, { history } from './configureStore'

describe('app', () => {
  it('renders empty app', () => {
    fetch.mockResponseOnce(JSON.stringify({ data: { children: [] } }))
    mount(
      <Provider store={configureStore()}>
        <ConnectedRouter history={history} hashType="noslash">
          <Route exact path="/" component={App} />
        </ConnectedRouter>
      </Provider>,
    )
  })

  it('renders error app', () => {
    fetch.mockResponseOnce('undefined')
    const store = configureStore()
    mount(
      <Provider store={store}>
        <ConnectedRouter history={history} hashType="noslash">
          <Route exact path="/" component={App} />
        </ConnectedRouter>
      </Provider>,
    )
  })

  it('renders app with posts', () => {
    fetch.resetMocks()
    fc.assert(
      fc.property(fc.array(fc.object(), 10), objects => {
        fetch.mockResponseOnce(JSON.stringify({ data: { children: objects } }))
        const store = configureStore()
        mount(
          <Provider store={store}>
            <ConnectedRouter history={history} hashType="noslash">
              <Route exact path="/" component={App} />
            </ConnectedRouter>
          </Provider>,
        )
      }),
    )
  })
})
