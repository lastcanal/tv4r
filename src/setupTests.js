import React from 'react'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import fetch, { GlobalWithFetchMock } from 'jest-fetch-mock'
import Enzyme, { shallow, render, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16' // React 16 Enzyme adapter
import { routerMiddleware } from 'connected-react-router'
import fc from 'fast-check'

// https://github.com/jsdom/jsdom/pull/2626
Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true })

Enzyme.configure({ adapter: new Adapter() }) // Make Enzyme functions available in all test files without importing

export const history = {
  location: {},
  action: 'POP',
  push: jest.fn(),
  replace: jest.fn(),
  go: jest.fn(),
  goBack: jest.fn(),
  goForward: jest.fn(),
  listen: jest.fn(),
}
const middleware = [thunk, routerMiddleware(history)]
const mockStore = configureMockStore(middleware)

const makeStore = (extra = {}) => {
  return mockStore({
    postsBySubreddit: {
      foo: {
        scope: 'new',
      },
    },
    selectedPost: {},
    selectedSubreddit: 'foo',
    subreddits: ['foo'],
    config: {
      themeMode: 'dark',
      isFullscreen: false,
      isPlaying: false,
      isAutoplay: false,
    },
    router: {
      history,
      location: {
        pathname: '/',
        search: '',
        hash: '',
      },
      action: 'POP',
    },
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
