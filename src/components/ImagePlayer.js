import React, { useEffect, useState, useLayoutEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import { nextPost, mediaFallback } from '../actions'

const styles = ({ palette }) => ({
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
    transform: 'translate3d(0,0,1px)',
    transition: 'height 0.39s, width 0.39s',
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

const ImagePlayer = ({
  height,
  post,
  isAutoAdvance,
  isMediaFallback,
  dispatch,
  classes,
}) => {

  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState(post.thumbnail)
  const [imgRef, setImgRef] = useState(null)
  const [imageWidth, setImageWidth] = useState(null)
  const [imageHeight, setImageHeight] = useState(height)

  const onError = (error) => {
    setLoading(false)
    dispatch(mediaFallback(error))
  }

  const onImageChange = () => {
    if (!imgRef) return

    const width = window.innerWidth
    const screenRatio = width / height
    const imageRatio = imgRef.width / imgRef.height
    if (screenRatio > imageRatio) {
      setImageWidth(null)
      setImageHeight(height)
    } else {
      setImageWidth(width)
      setImageHeight(null)
    }

    setLoading(url === post.thumbnail)
  }

  const enhance = () => {
    let decodedUrl = null
    if (post.preview?.enabled) {
      const parser = new DOMParser()
      const images = post.preview.images[0].resolutions
      const selectedImage = images.find((image) => image.height >= height) || {}
      const newUrl = selectedImage.url || images[images.length - 1]?.url
      if (newUrl) {
        decodedUrl = parser.parseFromString(newUrl, 'text/html')
          .body.textContent
      }
    }

    setUrl(decodedUrl || post.url)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isAutoAdvance) dispatch(nextPost())
    }, 5000)

    return () => clearTimeout(timeout)
  }, [post, isAutoAdvance])

  useEffect(() => {
    setLoading(true)
    setUrl(post.thumbnail)
    setImmediate(enhance)
  }, [post])

  useLayoutEffect(() => {
    onImageChange()
    enhance()
  }, [height])

  if (isMediaFallback) {
    return <div className={classes.error}>
      <h2>  Loading Embedded Image </h2>
      <a className={classes.fallbackLink} href={post.url}>
        Direct Link
      </a>
      <h5>via { post.domain }</h5>
    </div>
  }

  return <div className={classes.playerWrapper}>
    <img
      ref={setImgRef}
      src={url}
      height={imageHeight}
      width={imageWidth}
      style={{
        filter: loading ? `blur(8px)` : 'blur(0)',
      }}
      onLoad={onImageChange}
      onError={onError}
    />
  </div>
}

ImagePlayer.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
  error: PropTypes.object,
  isFetching: PropTypes.bool,
  isMediaFallback: PropTypes.bool,
  isAutoAdvance: PropTypes.bool,
  height: PropTypes.number,
  post: PropTypes.object,
}

const mapStateToProps = state => {
  const { dispatch, selectedSubreddit, postsBySubreddit, config } = state
  const { isFullsceen, isAutoAdvance } = config
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
  }
}

export default ImagePlayer |> connect(mapStateToProps) |> withStyles(styles)

