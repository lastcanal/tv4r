import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Route } from 'react-router'
import { ConnectedRouter } from 'connected-react-router'
import { PersistGate } from 'redux-persist/integration/react'

import App from './App'

import configureStore, { history } from './configureStore'

const { store, persistor } = configureStore()

render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history} hashType="noslash">
        <Route
          exact
          path="/r/:subreddit/comments/:postId/:slug"
          component={App}
        />
        <Route exact path="/r/:subreddit/:postId" component={App} />
        <Route exact path="/r/:subreddit" component={App} />
        <Route exact path="/" component={App} />
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
)
