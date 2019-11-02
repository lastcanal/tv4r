import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import ReactHtmlParser from 'react-html-parser'
import ReactPlayer from 'react-player'
import CircularProgress from '@material-ui/core/CircularProgress'

import { isVideo } from '../helpers'
import { nextPost, mediaFallback, playerScanAck, playerJumpAck } from '../actions'
import Comments from './Comments'

const styles = ({ palette }) => ({
  root: {
    margin: 0,
    padding: 0,
  },
  playerWrapper: {
    backgroundColor: palette.background.default,
    height: ({ height }) => (
      height
    ),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    top: 0,
    left: 0,
  },
  reactPlayer: {
    backgroundColor: 'black',
    animationName: '$blipOn',
    animationDuration: '1s',
    animationIterationCount: '1',
    animationFillMode: 'forwards',
    zIndex: 40,
  },
  loading: {
    backgroundColor: palette.background.default,
    height: ({ height }) => (
      height
    ),
    top: 0,
    botton: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 40,
  },
  '@keyframes blipOn': {
    '0%': { height: 4, width: 4, borderRadius: 10 },
    '40%': { height: 4, width: '90%', borderRadius: 0 },
    '100%': { borderRadius: 0 },
  },
})

const Post = ({
  classes,
  posts,
  isFetching,
  post,
  dispatch,
  isMediaFallback,
  height,
  isAutoAdvance,
  isPlaying,
  volume,
  scan,
  jump,
}) => {
  const playerRef = useRef()

  const onMediaEnded = () => {
    if (isAutoAdvance) dispatch(nextPost(posts))
  }

  const onMediaError = (error) => {
    dispatch(mediaFallback(error))
  }

  const mediaEmbedContent = () => {
    return new DOMParser().parseFromString(
      post.media_embed.content,
      'text/html',
    ).documentElement.textContent
  }

  const renderMediaEmbed = () => {
    if (post && isVideo(post)) {
      const transform = (node, _index) => {
        if (node.type === 'tag' && node.name === 'iframe') {
          node.attribs.height = height
          node.attribs.width = '100%'
        }
      }
      return (
        <div className={classes.playerWrapper}>
          {ReactHtmlParser(mediaEmbedContent(), { transform })}
        </div>
      )
    } else {
      return <div></div>
    }
  }

  useEffect(() => {
    if (scan === 0) return
    const player = playerRef.current
    if (player) {
      const currentTime = player.getCurrentTime()
      playerRef.current.seekTo(currentTime + scan, 'seconds')
    }
    dispatch(playerScanAck())
  }, [scan])

  useEffect(() => {
    if (jump === -1) return
    if (playerRef.current) {
      playerRef.current.seekTo(jump, 'fraction')
    }
    dispatch(playerJumpAck())
  }, [jump])

  const renderMediaPlayer = () => {
    return (
      <div className={classes.playerWrapper}>
        <ReactPlayer
          ref={playerRef}
          playing={isPlaying}
          volume={volume}
          preload="true"
          url={post.url}
          className={classes.reactPlayer}
          width="100%"
          height={height}
          onEnded={onMediaEnded}
          onError={onMediaError}
          controls={true}
        />
      </div>
    )
  }

  const renderMedia = () => {
    if (isMediaFallback) {
      return renderMediaEmbed()
    } else {
      return renderMediaPlayer()
    }
  }

  const renderLoading = () => {
    return <div className={classes.loading}>
      <CircularProgress />
    </div>
  }

  const renderEmpty = () => {
    return <div className={classes.loading}>
      <h2>No TV Found.</h2>
    </div>
  }

  const renderLoadingError = () => {
    return <div className={classes.loading}>
      <h2>Failed to load TV; try again..</h2>
    </div>
  }

  if (!posts || isFetching) {
    return renderLoading()
  } else if (posts.length === 0) {
    return renderEmpty()
  } else if (!post || !post.url) {
    return renderLoadingError()
  } else {
    return (
      <div style={{ opacity: isFetching ? 0.5 : 1 }}>
        <Container maxWidth={false} className={classes.root}>
          <div>{renderMedia()}</div>
        </Container>
        <Comments height={height} />
      </div>
    )
  }

}

Post.propTypes = {
  classes: PropTypes.object.isRequired,
  isMediaFallback: PropTypes.bool,
  dispatch: PropTypes.func,
  posts: PropTypes.array,
  error: PropTypes.object,
  isFetching: PropTypes.bool,
  isAutoAdvance: PropTypes.bool,
  isPlaying: PropTypes.bool,
  isFullsceen: PropTypes.bool,
  volume: PropTypes.number,
  height: PropTypes.number,
}

const mapStateToProps = state => {
  const { dispatch, selectedSubreddit, postsBySubreddit, config } = state
  const { isFullsceen, isAutoAdvance, isPlaying, volume, scan, jump } = config
  const selectedPost = postsBySubreddit.cursor || {}
  const { isFetching, items: posts } = postsBySubreddit[selectedSubreddit] || {
    isFetching: false,
    items: null,
  }

  return {
    dispatch,
    posts,
    isFetching,
    post: selectedPost.post,
    isMediaFallback: selectedPost.media_fallback,
    isFullsceen,
    isAutoAdvance,
    isPlaying,
    volume,
    scan,
    jump,
  }
}

export default Post |> connect(mapStateToProps) |> withStyles(styles)
