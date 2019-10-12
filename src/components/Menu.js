import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import ToolBar from '@material-ui/core/ToolBar';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { selectSubreddit, fetchPostsIfNeeded, invalidateSubreddit,
         nextPost, previousPost } from '../actions'

         import Picker from './Picker'
import Posts from './Posts'
import Post from './Post'
import HideOnScroll from './HideFootBar'
import PostsController from './PostsController'

import { DEFAULT_SUBREDDITS } from '../constants'

class Menu extends Component {
  static propTypes = {
    selectedSubreddit: PropTypes.string.isRequired,
    posts: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { dispatch, selectedSubreddit, match} = this.props
    const nextSubreddit = match ? match.params.subreddit : selectedSubreddit
    const subreddit = nextSubreddit || DEFAULT_SUBREDDITS[0]
    dispatch(invalidateSubreddit(subreddit))
    dispatch(fetchPostsIfNeeded(subreddit))
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedSubreddit !== this.props.selectedSubreddit) {
      const { dispatch, selectedSubreddit } = this.props
      dispatch(fetchPostsIfNeeded(selectedSubreddit))
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(e) {
    const { dispatch, posts } = this.props
    switch (e.key) {
      case 'ArrowRight':
        return dispatch(nextPost(posts));
      case 'ArrowLeft':
        return dispatch(previousPost(posts));
      default:
        return;
    }
  }

  handleChangeSubreddit = (nextSubreddit) => {
    this.props.dispatch(selectSubreddit(nextSubreddit))
  }

  handleRefreshClick = (e) => {
    e.preventDefault()
    const { dispatch, selectedSubreddit } = this.props
    dispatch(invalidateSubreddit(selectedSubreddit))
    dispatch(fetchPostsIfNeeded(selectedSubreddit))
  }

  handleNextClick = (e) => {
    e.preventDefault()
    const { dispatch, posts } = this.props
    dispatch(nextPost(posts))
  }

  handlePreviousClick = (e) => {
    e.preventDefault()
    const { dispatch, posts } = this.props
    dispatch(previousPost(posts))
  }

  render() {
    const { classes } = this.props;
    const { selectedSubreddit, posts, post,
            isFetching, lastUpdated, dispatch } = this.props
    const isEmpty = posts.length === 0
    return (
      <Container fluid classes={classes} maxWidth={false}>
        <HideOnScroll classes={classes.footbar} threshold={1}>
          <ToolBar>
            <PostsController parent={this} />
          </ToolBar>
          <ToolBar>
            <Posts />
          </ToolBar>
        </HideOnScroll>
      </Container>
    )
  }
}

const styles = (theme) => ({
  root: {
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    padding: 0,
  },
  footbar: {
    root: {
      backgroundColor: 'red'
    }
  },
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

export default connect(mapStateToProps)(withStyles(styles)(Menu))


