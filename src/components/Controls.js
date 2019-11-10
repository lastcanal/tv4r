import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, styled } from '@material-ui/core/styles'
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
import SyncIcon from '@material-ui/icons/Sync'
import SyncDisabledIcon from '@material-ui/icons/SyncDisabled'
import PhotoSizeSelectActualIcon from '@material-ui/icons/PhotoSizeSelectActual'
import MovieIcon from '@material-ui/icons/Movie'

import {
  nextPost,
  previousPost,
  configToggleFullscreen,
  configToggleAutoAdvance,
  configTogglePlay,
  configToggleThemeMode,
  configToggleShowVideos,
  configToggleShowImages,
  refreshSubreddit,
} from '../actions'

const AutoPlayOnIcon = styled(SyncIcon)({
  transform: 'scale(-1, 1) rotate(135deg)',
})

const AutoPlayOffIcon = styled(SyncDisabledIcon)({
  transform: 'scale(-1, 1) rotate(-90deg)',
})

const useStyles = makeStyles(({ breakpoints }) => ({
  controls: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'auto',
    marginBottom: 0,
    [breakpoints.up('md')]: {
      justifyContent: 'flex-end',
    },
  },
}))

export const ShowImagesControl = ({ showImages, onClick }) => (
  <Tooltip title="Filter Images">
    <IconButton
      aria-label="Filter Images"
      color="inherit"
      onClick={onClick}
    >
      <PhotoSizeSelectActualIcon
        style={{ opacity: showImages ? 1 : 0.5 }}
      />
    </IconButton>
  </Tooltip>
)

ShowImagesControl.propTypes = {
  showImages: PropTypes.bool,
  onClick: PropTypes.func,
}

export const ShowVideosControl = ({ showVideos, onClick }) => (
  <Tooltip title="Filter Videos">
    <IconButton
      aria-label="Filter Videos"
      color="inherit"
      onClick={onClick}
    >
      <MovieIcon
        style={{ opacity: showVideos ? 1 : 0.5 }}
      />
    </IconButton>
  </Tooltip>
)

ShowVideosControl.propTypes = {
  showVideos: PropTypes.bool,
  onClick: PropTypes.func,
}

export const RefreshControl = ({ onClick }) => (
  <Tooltip title="Refresh Subreddit">
    <IconButton
      aria-label="refresh content"
      color="inherit"
      onClick={onClick}
    >
      <RefreshIcon />
    </IconButton>
  </Tooltip>
)

RefreshControl.propTypes = {
  onClick: PropTypes.func,
}

const Controls = ({
  dispatch,
  posts,
  isFullscreen,
  isAutoAdvance,
  isPlaying,
  themeMode,
  showVideos,
  showImages,
}) => {
  const { controls } = useStyles()

  return (
    <div className={controls}>
      <ShowImagesControl
        showImages={showImages}
        onClick={() => dispatch(configToggleShowImages())}
      />
      <ShowVideosControl
        showVideos={showVideos}
        onClick={() => dispatch(configToggleShowVideos())}
      />
      <RefreshControl onClick={() => dispatch(refreshSubreddit())} />
      <Tooltip
        title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} theme`}
      >
        <IconButton
          aria-label={`toggle theme`} color="inherit"
          onClick={() => dispatch(configToggleThemeMode())}
        >
          <SettingsBrightnessIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={`${isFullscreen ? 'Exit' : 'Enter'} Fullscreen`}>
        <IconButton
          aria-label="toggle fullscreen"
          color="inherit"
          onClick={() => dispatch(configToggleFullscreen())}
        >
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </Tooltip>
      <Tooltip
        title={`${isAutoAdvance ? 'Stop' : 'Start'} Auto Advancing Videos`}
      >
        <IconButton
          aria-label="toggle auto advance" color="inherit"
          onClick={() => dispatch(configToggleAutoAdvance())}
        >
          {isAutoAdvance ? <AutoPlayOnIcon /> : <AutoPlayOffIcon />}
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
      <Tooltip title={`${isAutoAdvance ? 'Start' : 'Stop'} Playing Video`}>
        <IconButton
          aria-label={isPlaying ? 'Stop' : 'Play'} color="inherit"
          onClick={() => dispatch(configTogglePlay())}
        >
          {isPlaying ? <StopIcon /> : <PlayArrowIcon />}
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
  isAutoAdvance: PropTypes.bool,
  isPlaying: PropTypes.bool,
  themeMode: PropTypes.string,
  showVideos: PropTypes.bool,
  showImages: PropTypes.bool,
}

const mapStateToProps = state => {
  const { selectedSubreddit, postsBySubreddit, config } = state
  const subreddit = postsBySubreddit[selectedSubreddit]
  const posts = subreddit?.[subreddit?.scope]

  return {
    posts,
    ...config,
  }
}

export default Controls |> connect(mapStateToProps)
