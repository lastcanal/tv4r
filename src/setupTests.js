import React from 'react'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import fetch, { GlobalWithFetchMock } from 'jest-fetch-mock'
import Enzyme, { shallow, render, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16' // React 16 Enzyme adapter
import { connectRouter, routerMiddleware} from 'connected-react-router'
import fc from 'fast-check'
import { history } from './configureStore'

Enzyme.configure({ adapter: new Adapter() }) // Make Enzyme functions available in all test files without importing

const middleware = [thunk, routerMiddleware(history)]
const mockStore = configureMockStore(middleware)

const makeStore = (extra = {}) => {
  return mockStore({
    postsBySubreddit: {},
    selectedPost: {},
    selectedSubreddit: 'foo',
    subreddits: new Set(['foo']),
    router: connectRouter(history),
    ...extra,
  })
}

const customGlobal: GlobalWithFetchMock = global
customGlobal.fetch = fetch
customGlobal.fetchMock = customGlobal.fetch
customGlobal.shallow = shallow
customGlobal.render = render
customGlobal.mount = mount
customGlobal.React = React
customGlobal.makeStore = makeStore
// TODO: rename mockStore -> makeStore
customGlobal.mockStore = makeStore
customGlobal.fc = fc
