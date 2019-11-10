import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import { nextPost, mediaFallback } from '../actions'

const styles = ({ palette }) => ({
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
  error: {
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
  },
  fallbackLink: {
    color: palette.text.primary,
    fontSize: 60,
    textDecoration: 'none',
  },
})

const WebPagePlayer = ({
  height,
  post,
  isAutoPlay,
  isMediaFallback,
  dispatch,
  classes,
}) => {

  const [ref, setRef] = useState(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isAutoPlay) dispatch(nextPost())
    }, 5000)

    return () => clearTimeout(timeout)
  }, [post, isAutoPlay])

  const onError = (error) => {
    dispatch(mediaFallback(error))
  }

  const onLoad = () => {
    if (ref) {
      try {
        if (!ref.contentWindow.location.href) {
          onError()
        }
      } catch (e) {
        onError()
      }
    }
  }

  if (isMediaFallback) {
    return <div className={classes.error}>
      <h3> Failed to load embedded web page </h3>
      <a className={classes.fallbackLink} href={post.url}>
        Direct Link
      </a>
      <h5>via { post.domain }</h5>
    </div>
  }

  return <div className={classes.playerWrapper}>
    <iframe
      ref={(iframe) => setRef(iframe)}
      src={post.url}
      height={height}
      width={window.innerWidth}
      onLoad={onLoad}
      onError={onError}
    />
  </div>
}

WebPagePlayer.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
  error: PropTypes.object,
  isMediaFallback: PropTypes.bool,
  isFetching: PropTypes.bool,
  isAutoPlay: PropTypes.bool,
  height: PropTypes.number,
  post: PropTypes.object,
}

const mapStateToProps = state => {
  const { dispatch, selectedSubreddit, postsBySubreddit, config } = state
  const { isFullsceen, isAutoPlay } = config
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
    isAutoPlay,
  }
}

export default WebPagePlayer |> connect(mapStateToProps) |> withStyles(styles)


