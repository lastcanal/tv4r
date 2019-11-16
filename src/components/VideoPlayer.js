import React, { useEffect, useRef, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ReactHtmlParser from 'react-html-parser'
import ReactPlayer from 'react-player'
import throttle from 'lodash.throttle'

import {
  isVideo,
  isKnownMediaEmbed,
  getVideoDimensions,
  decodeHTMLEntity,
} from '../helpers'
import { nextPost, mediaFallback, playerScanAck, playerJumpAck } from '../actions'

const styles = () => ({
  reactPlayer: {
    backgroundColor: 'black',
    zIndex: 40,
  },
  playerWrapper: {
    objectFit: 'contain',
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    transform: 'translate3d(0,0,1px)',
    transition: 'height 0.39s, width 0.39s',
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
  const [playerHeight, setPlayerHeight] = useState(height)
  const [playerWidth, setPlayerWidth] = useState(window.innerWidth)

  const onMediaEnded = () => {
    if (isAutoAdvance) dispatch(nextPost())
  }

  const onMediaError = (error) => {
    dispatch(mediaFallback(error))
  }

  const renderMediaEmbed = () => {
    if (post && isVideo(post)) {
      const transform = (node, _index) => {
        if (node.type === 'tag' && node.name === 'iframe') {
          node.attribs.height = playerHeight || height
          node.attribs.width = playerWidth || '100%'
        }
      }

      const content = decodeHTMLEntity(post.media_embed.content)
      return (
        <div className={classes.playerWrapper}>
          {ReactHtmlParser(content, { transform })}
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

  useEffect(throttle(() => {
    const oEmbed = post.secure_media_embed || post.media_embed
    const img = getVideoDimensions(oEmbed, height, window.innerWidth)
    setPlayerWidth(img.width)
    setPlayerHeight(img.height)
  }, 100), [post, height, window.innerWidth])

  const renderMediaPlayer = () => {
    return <div className={classes.playerWrapper}>
      <ReactPlayer
        ref={playerRef}
        playing={isPlaying}
        volume={volume}
        preload="true"
        url={url}
        className={classes.reactPlayer}
        height={playerHeight}
        width={playerWidth}
        onEnded={onMediaEnded}
        onError={onMediaError}
        controls={true}
        loop={false}
      />
    </div>
  }

  if (isMediaFallback || isKnownMediaEmbed(post)) {
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

