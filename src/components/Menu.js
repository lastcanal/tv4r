import React, { useEffect } from 'react'
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

const Menu = ({ classes, dispatch, post, posts, selectedSubreddit, subreddits }) => {

  const changeSubreddit = ({ value }) => {
    dispatch(selectSubreddit(value))
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowRight':
          return dispatch(nextPost(posts))
        case 'ArrowLeft':
          return dispatch(previousPost(posts))
        default:
          return
      }
    }

    document.body.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.removeEventListener('keydown', handleKeyDown)
    }
  }, [posts])

  return (
    <Paper>
      <Container classes={classes} maxWidth={false}>
        <ToolBar>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Picker
                value={selectedSubreddit}
                onChange={changeSubreddit}
                options={subreddits}
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

Menu.propTypes = {
  selectedSubreddit: PropTypes.string,
  posts: PropTypes.array,
  post: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  subreddits: PropTypes.array,
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = state => {
  const { selectedSubreddit, postsBySubreddit, subreddits } = state
  const selectedPost = postsBySubreddit.cursor || {}
  const { isFetching, lastUpdated, items: posts } = postsBySubreddit[
    selectedSubreddit
  ] || {
    isFetching: true,
    items: [],
  }

  return {
    postsBySubreddit,
    selectedSubreddit,
    posts,
    isFetching,
    post: selectedPost.post,
    lastUpdated,
    subreddits,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Menu))
