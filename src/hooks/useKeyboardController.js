import { useEffect } from 'react'

import { handleKeyboardAction } from '../actions'

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
