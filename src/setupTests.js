import {GlobalWithFetchMock} from "jest-fetch-mock";
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';// React 16 Enzyme adapter
import React from 'react'
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import fetch from 'jest-fetch-mock'
import fc from 'fast-check'

Enzyme.configure({ adapter: new Adapter() });// Make Enzyme functions available in all test files without importing

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const makeStore = (extra = {}) => {
  return mockStore({ postsBySubreddit: {}, selectedPost: {}, selectedSubreddit: 'foo' });
};

const customGlobal: GlobalWithFetchMock = global;
customGlobal.fetch = fetch;
customGlobal.fetchMock = customGlobal.fetch;
customGlobal.shallow = shallow;
customGlobal.render = render;
customGlobal.mount = mount;
customGlobal.React = React
customGlobal.mockStore = mockStore
customGlobal.makeStore = makeStore
customGlobal.fc = fc
