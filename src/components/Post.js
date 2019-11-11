import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Skeleton from '@material-ui/lab/Skeleton'

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

const styles = ({ palette, spacing }) => ({
  root: {
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    scrollY: 'disabled',
  },
  loading: {
    backgroundColor: palette.background.default,
    height: ({ playerHeight }) => (
      playerHeight
    ),
    top: 0,
    botton: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 40,
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
  showNSFW,
  dispatch,
}) => {
  const renderMedia = () => {
    if (isVideo(post)) {
      return <VideoPlayer height={playerHeight} />
    } else if (isImage(post)) {
      return <ImagePlayer height={playerHeight} />
    } else if (post.is_self) {
      return '' // show comments section if is_self
    } else {
      return <WebPagePlayer height={playerHeight} />
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

  if (isFetching) {
    return renderLoading()
  } else if (error) {
    return renderLoadingError()
  } else if (!post || !post.url) {
    return renderEmpty()
  } else {
    return (
      <div style={{ opacity: isFetching ? 0.5 : 1 }}>
        <Container maxWidth={false} className={classes.root}>
          {(post.over_18 && !showNSFW) ? renderNSFW() : renderMedia()}
        </Container>
        <Comments playerHeight={playerHeight} menuHeight={menuHeight} />
      </div>
    )
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
  const { showImages, showVideos, showNSFW } = config
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
  }
}

export default Post |> connect(mapStateToProps) |> withStyles(styles)


