import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { routerMiddleware } from 'connected-react-router'
import { composeWithDevTools } from 'redux-devtools-extension';
import { createHashHistory } from 'history'

import thunk from 'redux-thunk'
import createRootReducer from './reducers'
import App from './App'
import { DEFAULT_SUBREDDIT } from './constants'


export const history = createHashHistory()
const middleware = [ thunk, routerMiddleware(history) ]
const devtools = window.__REDUX_DEVTOOLS_EXTENSION__
  ? window.__REDUX_DEVTOOLS_EXTENSION__({trace: true, traceLimit: 24})
  : noop => noop

const configureStore = () => (
  createStore(
    createRootReducer(history),
    compose(
      applyMiddleware(...middleware),
      devtools
    )
  )
)

export default configureStore
