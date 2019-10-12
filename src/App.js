import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectSubreddit, fetchPostsIfNeeded, invalidateSubreddit,
         nextPost, previousPost } from './actions'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ToolBar from '@material-ui/core/ToolBar';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import RefreshIcon from '@material-ui/icons/Refresh';

import Menu from './components/Menu'
import Picker from './components/Picker'
import Posts from './components/Posts'
import Post from './components/Post'
import HideFootBar from './components/HideFootBar'

import { DEFAULT_SUBREDDITS } from './constants'

class App extends Component {
  render() {
    const { classes, posts, isFetching } = this.props;
    return (
      <Container fluid="true" classes={classes} maxWidth={false}>
        {posts.length === 0
          ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
              <Post />
            </div>}
         <Menu />
      </Container>
    )
  }
}

const styles = (theme) => ({
  root: {
    backgroundColor: '#000',
    color: '#eee',
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: 20,
    minHeight: window.screen.availHeight * 1.2
  }
});

const mapStateToProps = state => {
  const { selectedSubreddit, postsBySubreddit, selectedPost } = state
  const {
    isFetching,
    lastUpdated,
    items: posts,
  } = postsBySubreddit[selectedSubreddit] || {
    isFetching: true,
    items: []
  }

  return {
    selectedSubreddit,
    posts,
    isFetching,
    post: selectedPost.post,
    lastUpdated
  }
}

export default connect(mapStateToProps)(withStyles(styles)(App))

