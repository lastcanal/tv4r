import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { isVideo } from '../helpers'
import ReactHtmlParser from 'react-html-parser'
import ReactPlayer from 'react-player'
import debounce from 'lodash.debounce'

import { nextPost, mediaFallback } from '../actions'
import Comments from './Comments'

import { MENU_OFFSET_HEIGHT } from '../constants'

const styles = _theme => ({
  root: {
    margin: 0,
    padding: 0,
    height: '100%',
  },
  playerWrapper: {
    backgroundColor: 'black',
  },
  reactPlayer: {
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    left: 0,
  },
})

const Post = ({ classes, posts, isFetching, post, dispatch, isMediaFallback }) => {

  const [ height, setHeight ] = useState(window.innerHeight - MENU_OFFSET_HEIGHT)

  const onResize = () => {
    setHeight(window.innerHeight - MENU_OFFSET_HEIGHT)
  }

  useEffect(() => {
    const listener = debounce(onResize, 500)
    window.addEventListener('resize', listener)
    return () => (window.removeEventListener('resize', listener))
  }, [])

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
          playing={false}
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
    return <h2>Loading...</h2>
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
}

const mapStateToProps = state => {
  const { dispatch, selectedSubreddit, postsBySubreddit } = state

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
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Post))
