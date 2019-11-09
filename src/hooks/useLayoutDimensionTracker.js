import { useState, useEffect, useMemo, useLayoutEffect, useRef } from 'react'
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

  useLayoutEffect(() => {
    setMenuHeight(calculateMenuHeight())
  }, [menuRef, orientation])

  useEffect(() => {
    setMenuOffsetHeight(isFullscreen ? 0 : menuHeight)
  }, [screenHeight, menuHeight, orientation])

  const calculateHeight = () => (
    window.innerHeight - menuOffsetHeight
  )

  useLayoutEffect(() => {
    setPlayerHeight(calculateHeight())
  }, [isFullscreen, screenHeight, menuOffsetHeight, orientation])

  const isMobile = useMemo(() => (
    typeof window.orientation !== 'undefined' ||
      navigator.userAgent.indexOf('IEMobile') !== -1
  ), [])

  const onResize = debounce(() => {
    // Prevent mobile browers resize-on-scroll due to system menu being hidden
    const newHeight = window.innerHeight
    const delta = Math.abs(screenHeight - newHeight)
    if (!isMobile || (delta > 100)) {
      setScreenHeight(newHeight)
      setMenuHeight(calculateMenuHeight())
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
    setScreenHeight(window.innnerHeight)
    setMenuHeight(calculateMenuHeight())
  }, [isFullscreen, isFetching])

  return [playerHeight, menuRef]
}

export default useLayoutDimensionTracker
