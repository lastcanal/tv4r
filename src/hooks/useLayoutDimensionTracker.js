import { useState, useEffect, useRef } from 'react'
import { useTheme } from '@material-ui/core/styles'
import debounce from 'lodash.debounce'

const useLayoutDimensionTracker = ({ isFullscreen, isFetching }) => {
  const { spacing } = useTheme()
  const menuRef = useRef()

  const calculateMenuHeight = () => {
    const { current } = menuRef
    if (current) {
      const box = current.getBoundingClientRect()
      return box.height + spacing(1)
    }
  }

  const menuOffsetHeight = () => {
    return isFullscreen ? 0 : calculateMenuHeight()
  }

  const calculateHeight = () => (
    window.innerHeight - menuOffsetHeight()
  )

  const [height, setHeight] = useState(calculateHeight())

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
