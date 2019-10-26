import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { IconButton, Tooltip } from '@material-ui/core'

import SkipNextIcon from '@material-ui/icons/SkipNext'
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious'
import RefreshIcon from '@material-ui/icons/Refresh'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit'
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import Brightness4Icon from '@material-ui/icons/Brightness4'

import {
  fetchPostsIfNeeded,
  invalidateSubreddit,
  nextPost,
  previousPost,
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
const Controls = ({ dispatch, posts, selectedSubreddit }) => {
  const isFullScreen = true
  const isAutoplaying = true
  const currentThemeMode = 'dark'
  const handleRefreshClick = e => {
    e.preventDefault()
    dispatch(invalidateSubreddit(selectedSubreddit))
    dispatch(fetchPostsIfNeeded(selectedSubreddit))
  }

  const handleNextClick = e => {
    e.preventDefault()
    dispatch(nextPost(posts))
  }

  const handlePreviousClick = e => {
    e.preventDefault()
    dispatch(previousPost(posts))
  }

  const classes = useStyles()

  return (
    <div className={classes.controls}>
      <Tooltip title="Refresh Subreddit" placement="top-start">
        <IconButton
          aria-label="refresh content"
          color="inherit"
          onClick={handleRefreshClick}
        >
          <RefreshIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={`Switch to ${currentThemeMode} theme`} placement="top-start">
        <IconButton aria-label={`Switch to ${currentThemeMode} theme`} color="inherit">
          {<Brightness4Icon />}
        </IconButton>
      </Tooltip>
      <Tooltip title={`${isFullScreen ? 'Activate' : 'Disable'} Fullscreen`} placement="top-start">
        <IconButton aria-label="toggle fullscreen" color="inherit">
          {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Auto-Play Videos" placement="top-start">
        <IconButton aria-label="toggle autoplay" color="inherit">
          {isAutoplaying ? <PlayCircleFilledWhiteIcon /> : <PlayCircleOutlineIcon />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Play Previous" placement="top-start">
        <IconButton
          aria-label="play previous"
          color="inherit"
          onClick={handlePreviousClick}
        >
          <SkipPreviousIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Play Next" placement="top-start">
        <IconButton aria-label="play next" color="inherit" onClick={handleNextClick}>
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
}

export default Controls
