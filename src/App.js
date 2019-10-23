import React, { useEffect, useMemo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { MuiThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import brown from '@material-ui/core/colors/brown';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { connect } from 'react-redux'
import { push, replace } from 'connected-react-router'

import Menu from './components/Menu'
import Post from './components/Post'

import { fetchPostsIfNeeded, invalidateSubredditIfNeeded } from './actions'

const styles = (theme) => ({
  root: {
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: theme.spacing(3),
  }
});

const App = ({ selectedSubreddit, postsBySubreddit,
               dispatch, classes, router}) => {

  useEffect(() => {
    dispatch(invalidateSubredditIfNeeded(selectedSubreddit))
    dispatch(fetchPostsIfNeeded(selectedSubreddit))
  }, [ selectedSubreddit, dispatch, router])

  useEffect(() => {
    if (postsBySubreddit.cursor && postsBySubreddit.cursor.post) {
      const permalink = postsBySubreddit.cursor.post.permalink
      if (permalink && permalink !== router.location.pathname)
        dispatch(push(permalink))
    }
  }, [ postsBySubreddit, dispatch, router])

  const prefersLightMode = useMediaQuery('(prefers-color-scheme: light)');

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersLightMode ? 'light' : 'dark',
          primary: grey,
          secondary: brown,
          contrastThreshold: (prefersLightMode ? 6 : 3)
        },
      }),
    [prefersLightMode],
  );

  return (
    <MuiThemeProvider theme={theme}>
      <Container classes={classes} maxWidth={false}>
        <Menu />
        <Post />
      </Container>
    </MuiThemeProvider>
  )
}

const mapStateToProps = ({
  selectedSubreddit, postsBySubreddit, router }) => ({
  selectedSubreddit, postsBySubreddit, router
})

export default connect(mapStateToProps)(withStyles(styles)(App))

