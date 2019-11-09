import { useEffect } from 'react'
import screenfull from 'screenfull'

import { configEnableFullscreen, configDisableFullscreen } from '../actions'

const useFullscreen = ({ dispatch, isFullscreen }) => {

  useEffect(() => {
    if (screenfull.isEnabled) {
      isFullscreen
        ? screenfull.isFullscreen || screenfull.request()
          .catch(() => dispatch(configDisableFullscreen()))
        : screenfull.isFullscreen && screenfull.exit()
      return () => screenfull.exit()
    }
  }, [isFullscreen])

  useEffect(() => {
    if (screenfull.isEnabled) {
      screenfull.isFullscreen
        ? isFullscreen || dispatch(configEnableFullscreen())
        : isFullscreen && dispatch(configDisableFullscreen())
    }
  }, [screenfull.isFullscreen])

}

export default useFullscreen
