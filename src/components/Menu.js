import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ToolBar from '@material-ui/core/ToolBar';

import { selectSubreddit, fetchPostsIfNeeded, invalidateSubreddit,
         nextPost, previousPost } from '../actions'

import Posts from './Posts'
import HideOnScroll from './HideFootBar'
import PostsController from './PostsController'

import { DEFAULT_SUBREDDITS } from '../constants'

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


