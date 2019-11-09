import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import { nextPost } from '../actions'

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

const ImagePlayer = ({
  height,
  post,
  isPlaying,
  dispatch,
  classes,
}) => {

  const [image, setImage] = useState({ loading: true, url: post.thumbnail })

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isPlaying) dispatch(nextPost())
    }, 5000)

    return () => clearTimeout(timeout)
  }, [post, isPlaying])

  const onLoad = () => {
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

    const url = decodedUrl || post.url
    setImage({ loading: url !== image.url, url })
  }

  useEffect(() => {
    setImage({ loading: true })
    onLoad()
  }, [post])

  return <div className={classes.playerWrapper}>
    <img
      src={image.url}
      style={{
        opacity: image.loading ? 0.5 : 1,
        transition: 'opacity 1s',
      }}
      onLoad={onLoad}
      height={image.loading ? height : height}
    />
  </div>
}

ImagePlayer.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
  error: PropTypes.object,
  isFetching: PropTypes.bool,
  isPlaying: PropTypes.bool,
  height: PropTypes.number,
  post: PropTypes.object,
}

const mapStateToProps = state => {
  const { dispatch, selectedSubreddit, postsBySubreddit, config } = state
  const { isFullsceen, isPlaying } = config
  const selectedPost = postsBySubreddit.cursor || {}
  const { isFetching } = postsBySubreddit[selectedSubreddit] || {
    isFetching: false,
    items: null,
  }

  return {
    dispatch,
    isFetching,
    post: selectedPost.post,
    isFullsceen,
    isPlaying,
  }
}

export default ImagePlayer |> connect(mapStateToProps) |> withStyles(styles)

