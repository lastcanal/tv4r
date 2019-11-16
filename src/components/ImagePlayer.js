import React, { useEffect, useState, useLayoutEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Skeleton from '@material-ui/lab/Skeleton'

import { nextPost, mediaFallback } from '../actions'
import { getPostImage, getImageDimensions } from '../helpers'

const styles = ({ palette }) => ({
  playerWrapper: {
    objectFit: 'contain',
    backgroundColor: 'black',
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
    fontSize: 30,
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

  const onImageChange = (ref = imgRef) => {
    const image =
      getImageDimensions(ref, height, window.innerWidth)

    setImageWidth(image.width)
    setImageHeight(image.height)
  }

  const enhance = () => {
    const image = getPostImage(post, height)
    setUrl(image.url || post.url)
    onImageChange(imgRef || image)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isAutoAdvance) dispatch(nextPost())
    }, 5000)

    return () => clearTimeout(timeout)
  }, [post, isAutoAdvance])

  useEffect(() => {
    setLoading(true)
    setImgRef(null)
    enhance()
  }, [post])

  useLayoutEffect(() => {
    enhance()
  }, [height, window.innerWidth])

  if (isMediaFallback) {
    return <div className={classes.error}>
      <h2> Loading Embedded Image </h2>
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
      height={loading ? 0 : imageHeight}
      width={loading ? 0 : imageWidth}
      onError={onError}
      onLoad={() => setLoading(false)}
    />
    <Skeleton
      variant="rect"
      height={loading ? imageHeight || height : 0 }
      width={loading ? imageWidth || window.innerWidth : 0}
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

