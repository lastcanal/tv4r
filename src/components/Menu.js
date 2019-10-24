import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import ToolBar from '@material-ui/core/ToolBar'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

import {
  selectSubreddit,
  nextPost,
  previousPost,
} from '../actions'

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
})

class Menu extends Component {
  static propTypes = {
    selectedSubreddit: PropTypes.string,
    posts: PropTypes.array,
    post: PropTypes.object,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
  }

  componentDidMount () {
    document.body.addEventListener('keydown', this.handleKeyDown.bind(this))
  }

  componentWillUnmount () {
    document.body.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown (e) {
    const { dispatch, posts } = this.props
    switch (e.key) {
      case 'ArrowRight':
        return dispatch(nextPost(posts))
      case 'ArrowLeft':
        return dispatch(previousPost(posts))
      default:
        return
    }
  }

  changeSubreddit ({ value }) {
    this.props.dispatch(selectSubreddit(value))
  }

  render () {
    const { classes, dispatch, post, posts, selectedSubreddit } = this.props

    return (
      <Paper>
        <Container classes={classes} maxWidth={false}>
          <ToolBar>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Picker
                  value={selectedSubreddit}
                  onChange={this.changeSubreddit.bind(this)}
                  options={DEFAULT_SUBREDDITS}
                />
              </Grid>
            </Grid>
          </ToolBar>
          <ToolBar>
            <Posts />
          </ToolBar>
          <ToolBar>
            <Controls
              dispatch={dispatch}
              posts={posts}
              selectedSubreddit={selectedSubreddit}
            />
            <Title post={post} />
          </ToolBar>
        </Container>
      </Paper>
    )
  }
}

const mapStateToProps = state => {
  const { selectedSubreddit, postsBySubreddit } = state
  const selectedPost = postsBySubreddit.cursor || {}
  const { isFetching, lastUpdated, items: posts } = postsBySubreddit[
    selectedSubreddit
  ] || {
    isFetching: true,
    items: [],
  }

  return {
    selectedSubreddit,
    posts,
    isFetching,
    post: selectedPost.post,
    lastUpdated,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Menu))
