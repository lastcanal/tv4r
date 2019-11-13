import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import debounce from 'lodash.debounce'

const useLayoutDimensionTracker = ({ isFullscreen, isFetching }) => {
  const menuRef = useRef()

  const [playerHeight, setPlayerHeight] = useState(0)
  const [menuHeight, setMenuHeight] = useState(0)
  const [menuOffsetHeight, setMenuOffsetHeight] = useState(0)
  const [orientation, setOrientation] = useState(0)
  const [screenHeight, setScreenHeight] = useState(window.innerHeight)

  const calculateMenuHeight = () => {
    const { current } = menuRef
    if (current) {
      const box = current.getBoundingClientRect()
      return box.height
    } else {
      return menuHeight
    }
  }

  const calculateHeight = () => (
    window.innerHeight - menuOffsetHeight
  )

  const onResize = debounce(() => {
    setScreenHeight(calculateHeight())
    setMenuHeight(calculateMenuHeight())
  }, 10)

  const onOrientationChange = () => {
    if (typeof window.orientation !== 'undefined') {
      setOrientation(window.orientation)
    }
  }
  useLayoutEffect(() => {
    setMenuHeight(calculateMenuHeight())
  }, [menuRef])

  useLayoutEffect(() => {
    setPlayerHeight(calculateHeight())
  }, [screenHeight, menuOffsetHeight])

  useLayoutEffect(() => {
    setMenuOffsetHeight(isFullscreen ? 0 : menuHeight)
  }, [isFullscreen, screenHeight, menuHeight, orientation])

  useLayoutEffect(() => {
    setScreenHeight(window.innnerHeight)
    setMenuHeight(calculateMenuHeight())
  }, [isFullscreen, isFetching, orientation])

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => (window.removeEventListener('resize', onResize))
  }, [])

  useEffect(() => {
    window.addEventListener('orientationchange', onOrientationChange)
    return () => (
      window.removeEventListener('orientationchange', onOrientationChange)
    )
  }, [])

  return [playerHeight, menuHeight, menuRef]
}

export default useLayoutDimensionTracker
