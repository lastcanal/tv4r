import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { routerMiddleware } from 'connected-react-router'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createBrowserHistory } from 'history'
import { Route } from 'react-router'
import { ConnectedRouter } from 'connected-react-router'

import thunk from 'redux-thunk'
import createRootReducer from './reducers'
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
