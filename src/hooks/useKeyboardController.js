import { useEffect } from 'react'

import {
  nextPost,
  previousPost,
  configTogglePlay,
  configToggleAutoAdvance,
  configEnableFullscreen,
  configDisableFullscreen,
  playerScanBackwards,
  playerScanForwards,
  playerVolumeUp,
  playerVolumeDown,
  playerJumpTo,
} from '../actions'


export const handleKeyboardAction = event => (dispatch, getState) => {
  const { config } = getState()
  if (!config.keyboardControls) return
  if (event.metaKey) return
  switch (event.key) {
    case '.':
    case '>':
      return dispatch(nextPost())
    case 'N':
    case 'n':
      return event.shiftKey ? dispatch(nextPost()) : void (0)
    case ',':
    case '<':
      return dispatch(previousPost())
    case 'P':
    case 'p':
      return event.shiftKey ? dispatch(previousPost()) : void (0)
    case ' ':
    case 'Space':
    case 'Enter':
    case 'k':
      if (!event.shiftKey) event.preventDefault()
      return dispatch(configTogglePlay())
    case 'a':
      return dispatch(configToggleAutoAdvance())
    case 'f':
      return dispatch(configEnableFullscreen())
    case 'Escape':
      return dispatch(configDisableFullscreen())
    case 'ArrowLeft':
      return dispatch(playerScanBackwards(5))
    case 'ArrowRight':
      return dispatch(playerScanForwards(10))
    case 'ArrowUp':
      if (!event.shiftKey) event.preventDefault()
      return dispatch(playerVolumeUp())
    case 'ArrowDown':
      if (!event.shiftKey) event.preventDefault()
      return dispatch(playerVolumeDown())
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      const jumpTo = parseInt(event.key, 10)
      return dispatch(playerJumpTo(jumpTo))
    case 'End':
      // if (!event.shiftKey) event.preventDefault()
      return dispatch(playerJumpTo(10))
    default:
      return
  }
}

const useKeyboardController = ({ dispatch }) => {
  const handleKeyDown = (event) => {
    dispatch(handleKeyboardAction(event))
  }

  useEffect(() => {
    document.body.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
}

export default useKeyboardController
