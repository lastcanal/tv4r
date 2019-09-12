import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk'
import reducer from './reducers'
import App from './containers/App'

const middleware = [ thunk ]

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware))
)

console.log('store', store)

render(
  <Provider store={store}>
    <HashRouter hashType="noslash">
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('root')
)
