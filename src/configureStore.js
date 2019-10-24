import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import { createHashHistory } from 'history'

import thunk from 'redux-thunk'
import createRootReducer from './reducers'

export const history = createHashHistory()
const middleware = [thunk, routerMiddleware(history)]
const devtools = window.__REDUX_DEVTOOLS_EXTENSION__
  ? window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true, traceLimit: 24 })
  : noop => noop

const configureStore = () =>
  createStore(
    createRootReducer(history),
    compose(
      applyMiddleware(...middleware),
      devtools,
    ),
  )

export default configureStore
