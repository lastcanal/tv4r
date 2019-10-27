import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import ReactHtmlParser from 'react-html-parser'
import ReactPlayer from 'react-player'

import { isVideo } from '../helpers'
import { nextPost, mediaFallback } from '../actions'
import Comments from './Comments'

const styles = ({ spacing, palette }) => ({
  root: {
    padding: 0,
    margin: 0,
    marginBottom: spacing(1),
    height: '100%',
  },
  playerWrapper: {
    backgroundColor: 'white',
  },
  reactPlayer: {
    backgroundColor: 'black',
    position: 'absolute',
    borderRadius: '0 50',
    animationName: '$fadeIn',
    animationDuration: '1s',
    animationIterationCount: '1',
    animationFillMode: 'forwards',
    top: 0,
    left: 0,
  },
  loading: {
    backgroundColor: palette.background.default,
    height: ({ height }) => (
      height
    ),
    width: '100vw',
    margin: 0,
    padding: 0,
    top: 0,
    botton: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 40,
  },
  loadingDot: {
    backgroundColor: 'black',
    height: 10,
    width: 10,
    borderRadius: 22,
    animationName: '$blipOn',
    animationDuration: '1s',
    animationIterationCount: '1',
    animationFillMode: 'forwards',
    zIndex: 41,
  },
  '@keyframes blipOn': {
    '0%': {width: 4, height: 4},
    '40%': {width: '90vw', height: 2},
    '100%': {width: '100vw', height: '100vh', borderRadius: 0},
  },
  '@keyframes borderOut': {
    '0%': {borderWidth: '40vw'},
    '40%': {
      borderTopWidth: '40vw',
      borderBottomWidth: '40vw',
      borderLeftWidth: '10vw',
      orderRightWidth: '10vw',
    },
    '100%': {borderWidth: '0'},
  },
  '@keyframes fadeIn': {
    '0%': {opacity: 0},
    '100%': {opacity: 1},
  },
})

const Post = ({ classes, posts, isFetching, post, dispatch, isMediaFallback, height, isAutoplay }) => {

  const [isPlayerReady, setPlayerReady] = useState(false)

  const onMediaEnded = () => {
    dispatch(nextPost(posts))
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
          node.attribs.class = classes.reactPlayer
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

  const renderMediaPlayer = () => {
    return (
      <div className={classes.playerWrapper}>
        <ReactPlayer
          playing={isAutoplay}
          preload="true"
          url={post.url}
          className={classes.reactPlayer}
          width="100%"
          height={height}
          onReady={() => setPlayerReady(true)}
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
    const dotClassName = isPlayerReady
      ? `${classes.loadingDot} ${classes.loadingDotLoaded}`
      : `${classes.loadingDot}`

    return <div className={classes.loading}>
      <div className={dotClassName} />
    </div>
  }

  const renderEmpty = () => {
    return <h2>No TV Found.</h2>
  }

  const renderLoadingError = () => {
    return <h2>Failed to load TV; try again..</h2>
  }

  if (isFetching) {
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
  isAutoplay: PropTypes.bool,
  isFullsceen: PropTypes.bool,
  height: PropTypes.number,
}

const mapStateToProps = state => {
  const { dispatch, selectedSubreddit, postsBySubreddit, config } = state
  const { isFullsceen, isAutoplay } = config
  const selectedPost = postsBySubreddit.cursor || {}
  const { isFetching, items: posts } = postsBySubreddit[selectedSubreddit] || {
    items: [],
  }

  return {
    dispatch,
    posts,
    isFetching,
    post: selectedPost.post,
    isMediaFallback: selectedPost.media_fallback,
    isFullsceen,
    isAutoplay,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Post))
