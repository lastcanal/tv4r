import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { MuiThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme } from '@material-ui/core/styles';
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
    minHeight: '200vh'
  }
});

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const App = ({ selectedSubreddit, selectedPost,
               dispatch, classes, router}) => {

  useEffect(() => {
    dispatch(invalidateSubredditIfNeeded(selectedSubreddit))
    dispatch(fetchPostsIfNeeded(selectedSubreddit))
  }, [ selectedSubreddit, dispatch, router])

  useEffect(() => {
    if (selectedPost.post) {
      const permalink = selectedPost.post.permalink
      if (permalink && permalink !== router.location.pathname)
        dispatch(push(permalink))
    }
  }, [ selectedPost, dispatch, router])

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
  selectedSubreddit, selectedPost, router }) => ({
  selectedSubreddit, selectedPost, router
})

export default connect(mapStateToProps)(withStyles(styles)(App))

