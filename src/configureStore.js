import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import { createHashHistory } from 'history'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import createRootReducer from './reducers'

export const history = createHashHistory()
const middleware = [thunk, routerMiddleware(history)]
const devtools = window.__REDUX_DEVTOOLS_EXTENSION__
  ? window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true, traceLimit: 24 })
  : noop => noop

const persistConfig = {
  key: 'tvr',
  storage,
  whitelist: ['subreddits', 'config'],
}

const rootReducer = createRootReducer(history)
const persistedReducer = persistReducer(persistConfig, rootReducer)

const configureStore = () => {
  const store = createStore(
    persistedReducer,
    compose(
      applyMiddleware(...middleware),
      devtools,
    ),
  )

  const persistor = persistStore(store)
  return { store, persistor }
}

export default configureStore
