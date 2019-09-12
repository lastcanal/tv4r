import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectSubreddit, fetchPostsIfNeeded, invalidateSubreddit,
         nextPost, previousPost } from '../actions'

import Picker from '../components/Picker'
import Posts from '../components/Posts'
import {Box, Container} from '@material-ui/core';

import {DEFAULT_SUBREDDITS} from '../constants'

class App extends Component {
  static propTypes = {
    selectedSubreddit: PropTypes.string.isRequired,
    posts: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  }

  handleKeyDown(e) {
    const { dispatch, posts} = this.props

    switch (e.key) {
      case 'ArrowRight':
        return dispatch(nextPost(posts));
      case 'ArrowLeft':
        return dispatch(previousPost(posts));
      default:
        return;
    }
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

  handleChange = nextSubreddit => {
    this.props.dispatch(selectSubreddit(nextSubreddit))
  }

  handleRefreshClick = e => {
    e.preventDefault()

    const { dispatch, selectedSubreddit } = this.props
    dispatch(invalidateSubreddit(selectedSubreddit))
    dispatch(fetchPostsIfNeeded(selectedSubreddit))
  }

  render() {
    const { selectedSubreddit, posts, post,
            isFetching, lastUpdated, dispatch } = this.props
    const isEmpty = posts.length === 0
    return (
      <Container fixed>
        <Picker value={selectedSubreddit}
                onChange={this.handleChange}
                options={DEFAULT_SUBREDDITS} />
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>
          }
          {!isFetching &&
            <button onClick={this.handleRefreshClick}>
              Refresh
            </button>
          }
        </p>
        {isEmpty
          ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
              <Posts />
            </div>
        }
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
    lastUpdated
  }
}

export default connect(mapStateToProps)(App)
