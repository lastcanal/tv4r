import React, { useEffect, useRef, useMemo } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ReactHtmlParser from 'react-html-parser'
import ReactPlayer from 'react-player'

import { isVideo } from '../helpers'
import { nextPost, mediaFallback, playerScanAck, playerJumpAck } from '../actions'

const styles = () => ({
  reactPlayer: {
    backgroundColor: 'black',
    zIndex: 40,
  },
  playerWrapper: {
    height: ({ height }) => (
      height
    ),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    top: 0,
    left: 0,
    backgroundColor: 'black',
    transform: 'translate3d(0,0,1px)',
  },
})

const VideoPlayer = ({
  classes,
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
    if (isAutoAdvance) dispatch(nextPost())
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

  const url = useMemo(() => (
    // eslint-disable-next-line camelcase
    (post.secure_media?.reddit_video?.fallback_url || post.url)
      .replace(/\.gifv/, '.mp4')
  ), [post])

  const renderMediaPlayer = () => {
    return <div className={classes.playerWrapper}>
      <ReactPlayer
        ref={playerRef}
        playing={isPlaying}
        volume={volume}
        playsinline={true}
        preload="true"
        url={url}
        className={classes.reactPlayer}
        width="100%"
        height={height}
        onEnded={onMediaEnded}
        onError={onMediaError}
        controls={true}
      />
    </div>
  }

  if (isMediaFallback) {
    return renderMediaEmbed()
  } else {
    return renderMediaPlayer()
  }

}

VideoPlayer.propTypes = {
  classes: PropTypes.object.isRequired,
  isMediaFallback: PropTypes.bool,
  dispatch: PropTypes.func,
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
  const { isFetching } = postsBySubreddit[selectedSubreddit] || {
    isFetching: false,
    items: null,
  }

  return {
    dispatch,
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

export default VideoPlayer |> connect(mapStateToProps) |> withStyles(styles)

