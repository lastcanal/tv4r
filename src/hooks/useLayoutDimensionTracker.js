import { useState, useEffect, useMemo, useLayoutEffect, useRef } from 'react'
import debounce from 'lodash.debounce'

const useLayoutDimensionTracker = ({ isFullscreen, isFetching }) => {
  const menuRef = useRef()

  const [playerHeight, setPlayerHeight] = useState(0)
  const [menuHeight, setMenuHeight] = useState(0)
  const [menuOffsetHeight, setMenuOffsetHeight] = useState(0)
  const [orientation, setOrientation] = useState(0)
  const [screenHeight, setScreenHeight] = useState(window.innerHeight)

  useLayoutEffect(() => {
    const { current } = menuRef
    if (current) {
      const box = current.getBoundingClientRect()
      setMenuHeight(box.height)
    }
  }, [menuRef, orientation])

  useEffect(() => {
    setMenuOffsetHeight(isFullscreen ? 0 : menuHeight)
  }, [isFullscreen, menuHeight, orientation])

  const calculateHeight = () => (
    window.innerHeight - menuOffsetHeight
  )

  useLayoutEffect(() => {
    setPlayerHeight(calculateHeight())
  }, [menuOffsetHeight, orientation])

  const IOS = useMemo(() => (
    navigator.userAgent.match(/iP(?:hone|ad;(?: U;)? CPU) OS (\d+)/)
  ), [])

  const onResize = debounce(() => {
    // prevent mobile safari/chrome from flailing
    const newHeight = window.innerHeight
    const delta = Math.abs(screenHeight - newHeight)
    if (!IOS || (delta > 100)) {
      setPlayerHeight(calculateHeight())
      setScreenHeight(newHeight)
    }
  }, 100)

  const onOrientationChange = () => {
    if (window.orientation) {
      setOrientation(window.orientation)
    }
  }

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

  useEffect(() => {
    setPlayerHeight(calculateHeight())
  }, [isFullscreen, isFetching])

  return [playerHeight, menuRef]
}

export default useLayoutDimensionTracker
