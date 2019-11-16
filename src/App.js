import React from 'react'
import PropTypes from 'prop-types'
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { connect } from 'react-redux'
import CssBaseline from '@material-ui/core/CssBaseline'

import Menu from './components/Menu'
import Post from './components/Post'

import useKeyboardController from './hooks/useKeyboardController'
import useLayoutDimensionTracker from './hooks/useLayoutDimensionTracker'
import useForceWindowFocus from './hooks/useForceWindowFocus'
import useRouteTracker from './hooks/useRouteTracker'
import useAppTheme from './hooks/useAppTheme'

const styles = () => ({
  root: {
    paddingLeft: 0,
    paddingRight: 0,
  },
})

const App = ({
  selectedSubreddit,
  postsBySubreddit,
  themeMode,
  isFullscreen,
  isFetching,
  dispatch,
  classes,
  router,
}) => {

  const theme = useAppTheme({ themeMode })
  const { playerHeight, menuHeight, menuRef } =
    useLayoutDimensionTracker({ isFullscreen, isFetching })
  useForceWindowFocus()
  useKeyboardController({ dispatch })
  useRouteTracker({ dispatch, postsBySubreddit, selectedSubreddit, router })

  return (
    <MuiThemeProvider theme={theme}>
      <Container classes={classes} maxWidth={false}>
        <CssBaseline />
        <Menu menuRef={menuRef} />
        <Post playerHeight={playerHeight} menuHeight={menuHeight} />
      </Container>
    </MuiThemeProvider>
  )
}

App.propTypes = {
  selectedSubreddit: PropTypes.string,
  postsBySubreddit: PropTypes.object,
  themeMode: PropTypes.string,
  isFullscreen: PropTypes.bool,
  isFetching: PropTypes.bool,
  dispatch: PropTypes.func,
  classes: PropTypes.object,
  router: PropTypes.object,
}

const mapStateToProps = ({
  selectedSubreddit,
  postsBySubreddit,
  router,
  config,
}) => {
  const { isFetching } = postsBySubreddit[selectedSubreddit] || {
    isFetching: false,
  }
  return {
    selectedSubreddit,
    postsBySubreddit,
    router,
    themeMode: config.themeMode,
    isFullscreen: config.isFullscreen,
    isFetching,
  }
}

export default App |> withStyles(styles) |> connect(mapStateToProps)
