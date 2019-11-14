import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import { nextPost } from '../actions'

const styles = ({ palette }) => ({
  playerWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    overflow: 'hidden',
    top: 0,
    left: 0,
    transition: 'height 0.39s, width 0.39s',
    transform: 'translate3d(0,0,1px)',
    '& iframe': {
      border: 0,
    },
  },
  error: {
    backgroundColor: palette.background.default,
    top: 0,
    botton: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 40,
  },
})

const WebPagePlayer = ({
  height,
  post,
  isAutoAdvance,
  dispatch,
  classes,
}) => {

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isAutoAdvance) dispatch(nextPost())
    }, 5000)

    return () => clearTimeout(timeout)
  }, [post, isAutoAdvance])

  return <div className={classes.playerWrapper}>
    <iframe
      src={post.url}
      height={height}
      width={window.innerWidth}
      sandbox="allow-scripts"
    />
  </div>
}

WebPagePlayer.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
  error: PropTypes.object,
  isFetching: PropTypes.bool,
  isAutoAdvance: PropTypes.bool,
  height: PropTypes.number,
  post: PropTypes.object,
}

const mapStateToProps = state => {
  const { dispatch, selectedSubreddit, postsBySubreddit, config } = state
  const { isFullsceen, isAutoAdvance } = config
  const selectedPost = postsBySubreddit.cursor || {}
  const { isFetching } = postsBySubreddit[selectedSubreddit] || {
    isFetching: false,
  }

  return {
    dispatch,
    isFetching,
    post: selectedPost.post,
    isFullsceen,
    isAutoAdvance,
  }
}

export default WebPagePlayer |> connect(mapStateToProps) |> withStyles(styles)


