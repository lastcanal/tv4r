import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import ReactHtmlParser from 'react-html-parser'
import ReactPlayer from 'react-player'
import CircularProgress from '@material-ui/core/CircularProgress'

import { isVideo } from '../helpers'
import { nextPost, mediaFallback } from '../actions'
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
    '0%': {height: 4, width: 4, borderRadius: 10},
    '40%': {height: 4, width: '90%', borderRadius: 0},
    '100%': {borderRadius: 0},
  },
})

const Post = ({ classes, posts, isFetching, post, dispatch, isMediaFallback, height, isAutoplay }) => {

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
  isAutoplay: PropTypes.bool,
  isFullsceen: PropTypes.bool,
  height: PropTypes.number,
}

const mapStateToProps = state => {
  const { dispatch, selectedSubreddit, postsBySubreddit, config } = state
  const { isFullsceen, isAutoplay } = config
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
    isAutoplay,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Post))
