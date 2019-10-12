import React from "react";
import ReactDOM from "react-dom";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import fetchMock from "fetch-mock";
import expect from "expect";
import pretty from "pretty";
import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Provider } from 'react-redux'

import Picker from "./components/Picker";
import Posts from "./components/Posts";
import App from "./App";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const makeStore = (extra = {}) => {
  return mockStore({ postsBySubreddit: {}, selectedPost: {} });
};

Enzyme.configure({ adapter: new Adapter() });

function setup(mountType = mount, ...props) {}

it("renders posts", () => {
  const store = makeStore();
  const props = { store };
  const enzymeWrapper = mount(
    <Provider store={store}>
      <App>
        <Posts />
      </App>
    </Provider>
  );
});
