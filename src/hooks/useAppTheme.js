import { useMemo } from 'react'
import {
  createMuiTheme,
} from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import grey from '@material-ui/core/colors/grey'

const useAppTheme = ({ themeMode }) => {
  const prefersLightMode = useMediaQuery('(prefers-color-scheme: light)')

  return useMemo(() => (
    createMuiTheme({
      palette: {
        type: themeMode || (prefersLightMode ? 'light' : 'dark'),
        primary: grey,
      },
      typography: {
        fontFamily: '"Noto Sans", Arial, sans-serif',
      },
    })
  ), [themeMode, prefersLightMode])
}

export default useAppTheme
