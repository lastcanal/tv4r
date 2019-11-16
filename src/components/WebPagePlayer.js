import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import { TogglePlayControl } from './Controls'
import { nextPost, configTogglePlay } from '../actions'

const styles = ({ palette, spacing }) => ({
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
  load: {
    height: ({ height }) => (
      height
    ),
    backgroundColor: palette.background.default,
    top: 0,
    botton: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 40,
    '& a': {
      color: palette.text.primary,
      fontSize: 30,
      textDecoration: 'none',
    },
  },
  controls: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: spacing(1),
  },
})

const WebPagePlayer = ({
  height,
  post,
  isAutoAdvance,
  isPlaying,
  dispatch,
  classes,
}) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isAutoAdvance) dispatch(nextPost())
    }, 5000)

    return () => clearTimeout(timeout)
  }, [post, isAutoAdvance])

  if (!isPlaying) {
    return <div className={classes.load}>
      <h2> Embedded WebPage </h2>
      <a href={post.url}>
        Direct Link
      </a>
      <h5>via { post.domain }</h5>
      <div className={classes.controls}>
        <TogglePlayControl
          isPlaying={isPlaying}
          onClick={() => {
            dispatch(configTogglePlay())
          }}
        />
      </div>
    </div>
  }

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
  isPlaying: PropTypes.bool,
  height: PropTypes.number,
  post: PropTypes.object,
}

const mapStateToProps = state => {
  const { dispatch, selectedSubreddit, postsBySubreddit, config } = state
  const { isFullsceen, isAutoAdvance, isPlaying } = config
  const selectedPost = postsBySubreddit.cursor || {}
  const { isFetching } = postsBySubreddit[selectedSubreddit] || {
    isFetching: false,
  }

  return {
    dispatch,
    isFetching,
    isPlaying,
    post: selectedPost.post,
    isFullsceen,
    isAutoAdvance,
  }
}

export default WebPagePlayer |> connect(mapStateToProps) |> withStyles(styles)


