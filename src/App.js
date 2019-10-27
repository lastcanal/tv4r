import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import grey from '@material-ui/core/colors/grey'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import CssBaseline from '@material-ui/core/CssBaseline'

import Menu from './components/Menu'
import Post from './components/Post'

import { fetchPostsIfNeeded, invalidateSubredditIfNeeded } from './actions'
import { MENU_OFFSET_HEIGHT } from './constants'

const styles = theme => ({
  root: {
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: theme.spacing(3),
  },
})

const App = ({
  selectedSubreddit,
  postsBySubreddit,
  themeMode,
  isFullscreen,
  dispatch,
  classes,
  router,
}) => {

  const menuOffsetHeight = () => (
    isFullscreen ? MENU_OFFSET_HEIGHT : 0
  )

  const calculateHeight = () => (
    window.innerHeight - menuOffsetHeight()
  )

  const [ height, setHeight ] = useState(calculateHeight())

  const onResize = () => {
    setHeight(window.innerHeight - menuOffsetHeight())
  }

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => (window.removeEventListener('resize', onResize))
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setHeight(calculateHeight())
  }, [isFullscreen])

  useEffect(() => {
    dispatch(invalidateSubredditIfNeeded(selectedSubreddit))
    dispatch(fetchPostsIfNeeded(selectedSubreddit))
  }, [selectedSubreddit, dispatch, router])

  useEffect(() => {
    if (postsBySubreddit.cursor && postsBySubreddit.cursor.post) {
      const permalink = postsBySubreddit.cursor.post.permalink
      if (permalink && permalink !== router.location.pathname) { dispatch(push(permalink)) }
    }
  }, [postsBySubreddit, dispatch, router])

  const prefersLightMode = useMediaQuery('(prefers-color-scheme: light)')

  const theme = useMemo(() => (
    createMuiTheme({
      palette: {
        type: themeMode || (prefersLightMode ? 'light' : 'dark'),
        primary: grey,
      },
    })
  ), [themeMode, prefersLightMode])

  return (
    <MuiThemeProvider theme={theme}>
      <Container classes={classes} maxWidth={false}>
        <CssBaseline />
        <Menu />
        <Post height={height} />
      </Container>
    </MuiThemeProvider>
  )
}

App.propTypes = {
  selectedSubreddit: PropTypes.string,
  postsBySubreddit: PropTypes.object,
  themeMode: PropTypes.string,
  isFullscreen: PropTypes.bool,
  dispatch: PropTypes.func,
  classes: PropTypes.object,
  router: PropTypes.object,
}

const mapStateToProps = ({ selectedSubreddit, postsBySubreddit, router, config }) => ({
  selectedSubreddit,
  postsBySubreddit,
  router,
  themeMode: config.themeMode,
  isFullscreen: config.isFullscreen,
})

export default connect(mapStateToProps)(withStyles(styles)(App))
