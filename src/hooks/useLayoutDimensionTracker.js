import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import debounce from 'lodash.debounce'

const useLayoutDimensionTracker = ({ isFullscreen, isFetching }) => {
  const menuRef = useRef()

  const [menuHeight, setMenuHeight] = useState(0)
  const [menuOffsetHeight, setMenuOffsetHeight] = useState(0)

  useLayoutEffect(() => {
    const { current } = menuRef
    if (current) {
      const box = current.getBoundingClientRect()
      setMenuHeight(box.height)
    }
  }, [menuRef])

  useEffect(() => {
    setMenuOffsetHeight(isFullscreen ? 0 : menuHeight)
  }, [isFullscreen, menuHeight])

  const calculateHeight = () => (
    (window.innerHeight - menuOffsetHeight)
  )

  const [height, setHeight] = useState(calculateHeight())

  useEffect(() => {
    setHeight(calculateHeight())
  }, [menuOffsetHeight])

  const onResize = debounce(() => {
    setHeight(calculateHeight())
  }, 100)

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => (window.removeEventListener('resize', onResize))
  }, [])

  useEffect(() => {
    setHeight(calculateHeight())
  }, [isFullscreen, isFetching])

  return [height, menuRef]
}

export default useLayoutDimensionTracker
