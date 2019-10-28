import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'

import App from './App'

import { history } from './setupTests'
import configureStore from './configureStore'

describe('app', () => {
  it('configures a store', () => {
    const { store, persistor } = configureStore()
    expect(store).toHaveProperty('dispatch')
    expect(persistor).toHaveProperty('dispatch')
  })

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
