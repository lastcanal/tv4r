import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { HashRouter, Route } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk'
import reducer from './reducers'
import App from './App'

const middleware = [ thunk ]

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware))
)

render(
  <Provider store={store}>
    <HashRouter hashType="noslash">
      <Route exact path="/" component={App} />
      <Route exact path="/r/:subreddit" component={App} />
    </HashRouter>
  </Provider>,
  document.getElementById('root')
)
