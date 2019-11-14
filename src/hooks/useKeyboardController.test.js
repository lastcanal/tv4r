import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'

import useKeyboardController, { handleKeyboardAction } from './useKeyboardController'
import { history } from '../setupTests'

import * as actions from '../actions'

describe('useKeyboardController', () => {

  it('handle heydown events', () => {
    const Wrapped = ({ dispatch }) => {
      useKeyboardController(store)
      return <div />
    }

    const store = makeStore()
    const wrapper = mount(
      <Provider store={store}>
        <ConnectedRouter history={history} hashType="noslash">
          <Wrapped dispatch={store.dispatch}/>
        </ConnectedRouter>
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()
  })


  it('should only work if enabled', () => {
    const store = makeStore({ config: { keyboardControls: false }})
    store.clearActions()
    store.dispatch(handleKeyboardAction({ key: '.' }))
    expect(store.getActions()[0]).toEqual(undefined)
  })

  it('should not work if metakey pressed', () => {
    const store = makeStore({ config: { keyboardControls: false }})
    store.clearActions()
    store.dispatch(handleKeyboardAction({ key: '.', metaKey: true }))
    expect(store.getActions()[0]).toEqual(undefined)
  })

  const testKeyboardAction = (key, action, extra = {}) => {
    const store = makeStore({ config: { keyboardControls: true }})
    store.clearActions()
    store.dispatch(handleKeyboardAction({ ...extra, key }))
    store.dispatch(action)
    const [a, b] = store.getActions()
    expect(a).toEqual(b)
  }

  it('should goto nextPost ', () => {
    testKeyboardAction('.', actions.nextPost())
    testKeyboardAction('>', actions.nextPost())
    testKeyboardAction('N', actions.nextPost(), { shiftKey: true })
    testKeyboardAction('n', actions.nextPost(), { shiftKey: true })
  })

  it('should goto previousPost', () => {
    testKeyboardAction(',', actions.previousPost())
    testKeyboardAction('<', actions.previousPost())
    testKeyboardAction('P', actions.previousPost(), { shiftKey: true })
    testKeyboardAction('p', actions.previousPost(), { shiftKey: true })
  })

  it('should configTogglePlay', () => {
    testKeyboardAction(' ', actions.configTogglePlay())
    testKeyboardAction('Space', actions.configTogglePlay())
    testKeyboardAction('Enter', actions.configTogglePlay())
    testKeyboardAction('k', actions.configTogglePlay())
  })

  it('should configToggleAutoAdvance', () => {
    testKeyboardAction('a', actions.configToggleAutoAdvance())
  })

  it('should configEnableFullscreen', () => {
    testKeyboardAction('f', actions.configEnableFullscreen())
  })

  it('should configDisableFullscreen', () => {
    testKeyboardAction('Escape', actions.configDisableFullscreen())
  })

  it('should playerScanBackwards', () => {
    testKeyboardAction('ArrowLeft', actions.playerScanBackwards(5))
  })

  it('should playerScanForwards', () => {
    testKeyboardAction('ArrowRight', actions.playerScanForwards(10))
  })

  it('should playerVolumeUp', () => {
    testKeyboardAction('ArrowUp', actions.playerVolumeUp())
  })

  it('should playerVolumeDown', () => {
    testKeyboardAction('ArrowDown', actions.playerVolumeDown())
  })

  it('should playerJumpTo', () => {
    Array(9).fill().map((_, i) => (
      testKeyboardAction(i.toString(), actions.playerJumpTo(i))
    ))
  })

  it('should end', () => {
    testKeyboardAction('End', actions.playerJumpTo(10))
  })
})
