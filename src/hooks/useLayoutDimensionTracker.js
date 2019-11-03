import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import debounce from 'lodash.debounce'

const useLayoutDimensionTracker = ({ isFullscreen, isFetching }) => {
  const menuRef = useRef()

  const [height, setHeight] = useState(0)
  const [menuHeight, setMenuHeight] = useState(0)
  const [menuOffsetHeight, setMenuOffsetHeight] = useState(0)
  const [menuWidth, setMenuWidth] = useState(document.innerWidth)
  const [orientation, setOrientation] = useState(0)

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
    (window.innerHeight - menuOffsetHeight)
  )

  useLayoutEffect(() => {
    setHeight(calculateHeight())
  }, [menuOffsetHeight, orientation])

  const onResize = debounce(() => {
    // prevent mobile safari/chrome from flailing
    if (menuWidth !== document.innerWidth) {
      setHeight(calculateHeight())
      setMenuWidth(document.innerWidth)
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
    setHeight(calculateHeight())
  }, [isFullscreen, isFetching])

  return [height, menuRef]
}

export default useLayoutDimensionTracker
