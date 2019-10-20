import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ToolBar from '@material-ui/core/ToolBar';
import Paper from '@material-ui/core/Paper';

import { selectSubreddit, fetchPostsIfNeeded, invalidateSubreddit,
         nextPost, previousPost } from '../actions'

import { DEFAULT_SUBREDDITS } from '../constants'

import Posts from './Posts'
import Picker from './Picker'
import Controls from './Controls'
import Title from './Title'

const styles = ({ palette }) => ({
  root: {
    position: 'fixed',
    left: 0,
    bottom: 0,
    padding: 0,
    width: '100%',
    backgroundColor: palette.background.default,
  },
});

class Menu extends Component {
  static propTypes = {
    selectedSubreddit: PropTypes.string,
    posts: PropTypes.array,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  // istanbul ignore next //
  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleKeyDown);
  }

  // istanbul ignore next //
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

  // istanbul ignore next //
  changeSubreddit(nextSubreddit) {
    this.props.dispatch(selectSubreddit(nextSubreddit))
  }

  render() {
    const { classes, dispatch, post, posts, selectedSubreddit } = this.props;
    return <Paper>
      <Container classes={classes} maxWidth={false}>
        <ToolBar>
          <Posts />
        </ToolBar>
        <ToolBar>
          <Controls dispatch={dispatch} posts={posts}
                    selectedSubreddit={selectedSubreddit} />
          <Picker value={selectedSubreddit}
                  onChange={this.changeSubreddit.bind(this)}
                  options={DEFAULT_SUBREDDITS} />
          <Title post={post} />
        </ToolBar>
      </Container>
    </Paper>
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


