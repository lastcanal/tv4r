import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { IconButton, Tooltip } from '@material-ui/core'
import { connect } from 'react-redux'

import SkipNextIcon from '@material-ui/icons/SkipNext'
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious'
import RefreshIcon from '@material-ui/icons/Refresh'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit'
import SettingsBrightnessIcon from '@material-ui/icons/SettingsBrightness'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import StopIcon from '@material-ui/icons/Stop'

import {
  fetchPostsIfNeeded,
  invalidateSubreddit,
  nextPost,
  previousPost,
  configToggleFullscreen,
  configToggleAutoplay,
  configToggleThemeMode,
} from '../actions'

const useStyles = makeStyles(({ spacing }) => ({
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: spacing(1),
  },
  playIcon: {
    height: spacing(3),
    width: spacing(3),
  },
}))
const Controls = ({ dispatch, posts, selectedSubreddit, isFullscreen, isAutoplay, themeMode }) => {
  const handleRefreshClick = _e => {
    dispatch(invalidateSubreddit(selectedSubreddit))
    dispatch(fetchPostsIfNeeded(selectedSubreddit))
  }

  const classes = useStyles()

  return (
    <div className={classes.controls}>
      <Tooltip title="Refresh Subreddit">
        <IconButton
          aria-label="refresh content"
          color="inherit"
          onClick={handleRefreshClick}
        >
          <RefreshIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={`Switch to ${themeMode} theme`}>
        <IconButton
          aria-label={`Switch to ${themeMode} theme`} color="inherit"
          onClick={() => dispatch(configToggleThemeMode())}
        >
          <SettingsBrightnessIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={`${isFullscreen ? 'Enter' : 'Exit'} Fullscreen`}>
        <IconButton
          aria-label="toggle fullscreen"
          color="inherit"
          onClick={() => dispatch(configToggleFullscreen())}
        >
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Play Previous">
        <IconButton
          aria-label="play previous"
          color="inherit"
          onClick={() => dispatch(previousPost(posts))}
        >
          <SkipPreviousIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={`${isAutoplay ? 'Start' : 'Stop'} Auto-Playing Videos`}>
        <IconButton
          aria-label="toggle autoplay" color="inherit"
          onClick={() => dispatch(configToggleAutoplay())}
        >
          {isAutoplay ? <StopIcon /> : <PlayArrowIcon />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Play Next">
        <IconButton
          aria-label="play next"
          color="inherit"
          onClick={() => dispatch(nextPost(posts))}
        >
          <SkipNextIcon />
        </IconButton>
      </Tooltip>
    </div>
  )
}

Controls.propTypes = {
  dispatch: PropTypes.func.isRequired,
  posts: PropTypes.array,
  selectedSubreddit: PropTypes.string,
  isFullscreen: PropTypes.bool,
  isAutoplay: PropTypes.bool,
  themeMode: PropTypes.string,
}

const mapStateToProps = state => {
  const { selectedSubreddit, postsBySubreddit, config } = state
  const { items: posts } = postsBySubreddit[
    selectedSubreddit
  ] || {
    items: [],
  }

  return {
    selectedSubreddit,
    posts,
    ...config,
  }
}

export default connect(mapStateToProps)(Controls)

