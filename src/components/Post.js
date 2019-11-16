import React, { useEffect, useState, useMemo } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Skeleton from '@material-ui/lab/Skeleton'
import throttle from 'lodash.throttle'

import { isVideo, isImage } from '../helpers'

import Comments from './Comments'
import VideoPlayer from './VideoPlayer'
import ImagePlayer from './ImagePlayer'
import WebPagePlayer from './WebPagePlayer'

import {
  ShowVideosControl,
  ShowImagesControl,
  ShowNSFWControl,
  RefreshControl,
} from './Controls'

import {
  configToggleShowVideos,
  configToggleShowImages,
  refreshSubreddit,
  configToggleNSFW,
} from '../actions'

const miniPlayerWidth = () =>
  Math.min(480, window.innerWidth * (0.39))

const miniPlayerHeight = () =>
  miniPlayerWidth() * (9 / 16)

const styles = ({ palette, spacing, breakpoints }) => ({
  root: {
    height: ({ playerHeight }) => (
      playerHeight
    ),
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    scrollY: 'disabled',
    backgroundColor: 'black',
  },
  miniPlayer: {
    position: 'fixed',
    bottom: ({ menuHeight }) => menuHeight,
    right: 0,
    width: miniPlayerWidth,
    backgroundColor: 'transparent',
    opacity: 0.9,
    [breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  loading: {
    backgroundColor: palette.background.default,
    height: ({ playerHeight }) => (
      playerHeight
    ),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  controls: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: spacing(1),
  },
})

const Post = ({
  classes,
  error,
  isFetching,
  post,
  playerHeight,
  menuHeight,
  showImages,
  showVideos,
  isPlaying,
  showNSFW,
  dispatch,
}) => {

  const [showMiniPlayer, setShowMiniPlayer] = useState(false)

  const renderMedia = () => {
    const height = showMiniPlayer
      ? miniPlayerHeight()
      : playerHeight
    if (isVideo(post)) {
      return <VideoPlayer height={height} />
    } else if (isImage(post)) {
      return <ImagePlayer height={height} />
    } else if (post.is_self) {
      return '' // show comments section if is_self
    } else {
      return <WebPagePlayer height={height} />
    }
  }

  const renderLoading = () => {
    return <div className={classes.loading}>
      <Skeleton width="100%" height="100%"/>
    </div>
  }

  const renderEmpty = () => {
    return <div className={classes.loading}>
      <h2>No TV Found.</h2>
      <h5>Try changing some filters</h5>
      <div className={classes.controls}>
        <ShowImagesControl
          showImages={showImages}
          onClick={() => dispatch(configToggleShowImages())}
        />
        <ShowVideosControl
          showVideos={showVideos}
          onClick={() => dispatch(configToggleShowVideos())}
        />
      </div>
      <div className={classes.controls}>
        <RefreshControl onClick={() => dispatch(refreshSubreddit())} />
      </div>
    </div>
  }

  const renderNSFW = () => {
    return <div className={classes.loading}>
      <h2>NSFW Content.</h2>
      <h5>You must remove the NSFW filter to proceed.</h5>
      <div className={classes.controls}>
        <ShowNSFWControl
          showNSFW={showNSFW}
          onClick={() => dispatch(configToggleNSFW())}
        />
      </div>
    </div>
  }

  const renderLoadingError = () => {
    return <div className={classes.loading}>
      <h2>Failed to load TV; try again..</h2>
    </div>
  }

  const isNSFW = useMemo(() => (
    // eslint-disable-next-line camelcase
    post?.over_18
  ), [post])

  const showMiniPlayerIfNeeded = throttle(() => {
    if (!isPlaying) {
      setShowMiniPlayer(false)
    } else if (
      isVideo(post) &&
      window.pageYOffset > 0 && playerHeight > 0 &&
      window.pageYOffset >= playerHeight
    ) {
      setShowMiniPlayer(isNSFW ? showNSFW : true)
    } else if (
      window.pageYOffset === 0 ||
      window.pageYOffset < (playerHeight)
    ) {
      setShowMiniPlayer(false)
    }
  }, 100)

  useEffect(() => {
    showMiniPlayerIfNeeded()
    window.addEventListener('scroll', showMiniPlayerIfNeeded)
    return () => (
      window.removeEventListener('scroll', showMiniPlayerIfNeeded)
    )
  }, [playerHeight, showNSFW, isNSFW, isPlaying])

  if (isFetching) {
    return renderLoading()
  } else if (error) {
    return renderLoadingError()
  } else if (!post || !post.url) {
    return renderEmpty()
  } else {
    const className = showMiniPlayer
      ? classes.miniPlayer : classes.root
    return <div style={{ opacity: isFetching ? 0.5 : 1 }}>
      <div
        className={classes.loading}
        style={{ display: showMiniPlayer ? 'block' : 'none' }}
      >
        <h2>Using Mini Player...</h2>
      </div>
      <Container maxWidth={false} className={className}>
        {(post.over_18 && !showNSFW) ? renderNSFW() : renderMedia()}
      </Container>
      <Comments playerHeight={playerHeight} menuHeight={menuHeight} />
    </div>
  }

}

Post.propTypes = {
  isFetching: PropTypes.bool,
  post: PropTypes.object,
  playerHeight: PropTypes.number,
  menuHeight: PropTypes.number,
  showImages: PropTypes.bool,
  showVideos: PropTypes.bool,
  showNSFW: PropTypes.bool,
  error: PropTypes.object,
  classes: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
}

const mapStateToProps = state => {
  const { selectedSubreddit, postsBySubreddit, config } = state
  const { showImages, showVideos, showNSFW, isPlaying } = config
  const selectedPost = postsBySubreddit.cursor || {}
  const { isFetching } = postsBySubreddit[selectedSubreddit] || {
    isFetching: false,
  }

  return {
    isFetching,
    post: selectedPost.post,
    showImages,
    showVideos,
    showNSFW,
    isPlaying,
  }
}

export default Post |> connect(mapStateToProps) |> withStyles(styles)


