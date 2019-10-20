import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Route } from 'react-router'

import Picker from "./components/Picker";
import Posts from "./components/Posts";
import App from "./App";

import configureStore, { history } from './configureStore'

it("renders empty posts", () => {
  fetch.mockResponseOnce(JSON.stringify({ data: { children: [ ] }}))

  const enzymeWrapper = mount(
    <Provider store={configureStore()}>
      <ConnectedRouter history={history} hashType="noslash">
        <Route exact path="/" component={App} />
      </ConnectedRouter>
    </Provider>
  );
});

it("renders error posts", () => {
  fetch.mockResponseOnce('undefined')

  const store = makeStore();
  const enzymeWrapper = mount(
    <Provider store={configureStore()}>
      <ConnectedRouter history={history} hashType="noslash">
        <Route exact path="/" component={App} />
      </ConnectedRouter>
    </Provider>
  );
});

it("renders posts", () => {
  fetch.resetMocks()
  fc.assert(fc.property(fc.array(fc.object(), 10), (objects) => {
    fetch.mockResponseOnce(JSON.stringify({ data: { children: objects }}))
    const store = makeStore();
    const enzymeWrapper = mount(
      <Provider store={configureStore()}>
        <ConnectedRouter history={history} hashType="noslash">
          <Route exact path="/" component={App} />
        </ConnectedRouter>
      </Provider>
    );
  }))
});
