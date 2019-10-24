import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Route } from 'react-router'
import { ConnectedRouter } from 'connected-react-router'

import App from './App'

import configureStore, { history } from './configureStore'

const store = configureStore()

render(
  <Provider store={store}>
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
  </Provider>,
  document.getElementById('root'),
)
