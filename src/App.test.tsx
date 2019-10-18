import { Provider } from 'react-redux'

import Picker from "./components/Picker";
import Posts from "./components/Posts";
import App from "./App";

it("renders empty posts", () => {
  fetch.mockResponseOnce(JSON.stringify({ data: { children: [ ] }}))

  const store = makeStore();
  const enzymeWrapper = mount(
    <Provider store={store}>
      <App />
    </Provider>
  );
});

it("renders error posts", () => {
  fetch.mockResponseOnce('undefined')

  const store = makeStore();
  const enzymeWrapper = mount(
    <Provider store={store}>
      <App />
    </Provider>
  );
});

it("renders posts", () => {
  fetch.resetMocks()
  fc.assert(fc.property(fc.array(fc.object(), 10), (objects) => {
    fetch.mockResponseOnce(JSON.stringify({ data: { children: objects }}))
    const store = makeStore();
    const enzymeWrapper = mount(
      <Provider store={store}>
        <App />
      </Provider>
    );
  }))
});
