import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import { nextPost, mediaFallback } from '../actions'

const styles = () => ({
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

const WebPagePlayer = ({
  height,
  post,
  isAutoPlay,
  isMediaFallback,
  dispatch,
  classes,
}) => {

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isAutoPlay) dispatch(nextPost())
    }, 5000)

    return () => clearTimeout(timeout)
  }, [post, isAutoPlay])

  const onLoad = () => { setLoading(false) }

  const onError = (error) => {
    setLoading(false)
    dispatch(mediaFallback(error))
  }

  useEffect(() => {
    setLoading(true)
  }, [post])

  if (!loading && isMediaFallback) {
    return <div className={classes.playerWrapper}>
      <h2>Error Loading WebPage.</h2>
      <h5><a href={post.url}> Visit Webpage Directly </a></h5>
    </div>
  }

  return <div className={classes.playerWrapper}>
    <iframe
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
    items: null,
  }

  return {
    dispatch,
    isFetching,
    post: selectedPost.post,
    isFullsceen,
    isAutoPlay,
  }
}

export default WebPagePlayer |> connect(mapStateToProps) |> withStyles(styles)


