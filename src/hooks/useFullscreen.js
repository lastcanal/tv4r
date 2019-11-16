import { useEffect } from 'react'
import screenfull from 'screenfull'

import { configEnableFullscreen, configDisableFullscreen } from '../actions'

const useFullscreen = ({ dispatch, isFullscreen }) => {

  useEffect(() => {
    if (isFullscreen) {
      screenfull.request().catch(() => {})
    } else {
      screenfull.exit()
    }
  }, [isFullscreen])

  useEffect(() => {
    if (screenfull.isEnabled) {
      if (screenfull.isFullscreen && !isFullscreen) {
        dispatch(configEnableFullscreen())
      } else if (!screenfull.isFullscreen && isFullscreen) {
        dispatch(configDisableFullscreen())
      }
    }
  }, [screenfull.isFullscreen])

}

export default useFullscreen
