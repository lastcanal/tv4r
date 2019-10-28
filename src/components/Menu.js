import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import ToolBar from '@material-ui/core/ToolBar'

import { MENU_OFFSET_HEIGHT } from '../constants'

import {
  selectSubreddit,
  nextPost,
  previousPost,
} from '../actions'

import Posts from './Posts'
import Picker from './Picker'
import Controls from './Controls'
import Title from './Title'

const styles = ({ palette, spacing }) => ({
  root: {
    position: 'fixed',
    left: 0,
    bottom: 0,
    padding: 0,
    paddingBottom: spacing(2),
    minHeight: MENU_OFFSET_HEIGHT,
    width: '100%',
    backgroundColor: palette.background.default,
    borderTop: '1px soild black',
    boxShadow: `0px -2px 2px -2px ${palette.primary.dark}`,
  },
})

const Menu = ({
  classes,
  dispatch,
  post,
  posts,
  selectedSubreddit,
  subreddits,
  width,
  menuRef,
}) => {

  const changeSubreddit = ({ value }) => {
    dispatch(selectSubreddit(value))
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      e.stopPropagation()
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
    <Container ref={menuRef} classes={classes} maxWidth={false}>
      <ToolBar>
        <Picker
          value={selectedSubreddit}
          onChange={changeSubreddit}
          options={subreddits}
        />
      </ToolBar>
      <Posts width={width} />
      <ToolBar>
        <Title post={post} />
        <Controls />
      </ToolBar>
    </Container>
  )
}

Menu.propTypes = {
  selectedSubreddit: PropTypes.string,
  posts: PropTypes.array,
  post: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  subreddits: PropTypes.array,
  width: PropTypes.number,
  menuHeight: PropTypes.number,
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  menuRef: PropTypes.object,
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
