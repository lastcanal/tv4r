import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import ToolBar from '@material-ui/core/ToolBar'

import {
  loadSubreddit,
} from '../actions'

import Posts from './Posts'
import Picker from './Picker'
import Controls from './Controls'
import Title from './Title'

const styles = ({ palette, spacing, shape }) => ({
  root: {
    position: 'fixed',
    left: 0,
    bottom: 0,
    padding: 0,
    paddingBottom: spacing(2),
    width: '100%',
    backgroundColor: palette.background.default,
    borderTop: '1px soild black',
    boxShadow: `-1px -4px 4px -4px ${palette.primary.dark}`,
    borderRadius: shape.borderRadius,
  },
})

const Menu = ({
  classes,
  dispatch,
  post,
  selectedSubreddit,
  subreddits,
  menuRef,
}) => {

  const changeSubreddit = ({ value }) => {
    dispatch(loadSubreddit(value))
  }

  return (
    <Container ref={menuRef} classes={classes} maxWidth={false}>
      <ToolBar>
        <Picker
          value={selectedSubreddit}
          onChange={changeSubreddit}
          options={subreddits}
        />
      </ToolBar>
      <Posts />
      <ToolBar>
        <Title post={post} />
        <Controls />
      </ToolBar>
    </Container>
  )
}

Menu.propTypes = {
  selectedSubreddit: PropTypes.string,
  post: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  subreddits: PropTypes.array,
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  menuRef: PropTypes.object,
}

const mapStateToProps = state => {
  const { selectedSubreddit, postsBySubreddit, subreddits } = state
  const selectedPost = postsBySubreddit.cursor || {}
  const { isFetching, lastUpdated } = postsBySubreddit[
    selectedSubreddit
  ] || {
    isFetching: true,
    items: [],
  }

  return {
    postsBySubreddit,
    selectedSubreddit,
    isFetching,
    post: selectedPost.post,
    lastUpdated,
    subreddits,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Menu))
