import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { isVideo } from '../helpers'
import ReactHtmlParser from 'react-html-parser';
import ReactPlayer from 'react-player'

import { nextPost, mediaFallback } from '../actions'

const styles = theme => ({
  root: {
    margin: 0,
    padding: 0,
  },
  playerWrapper: {},
  reactPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  spacer: {
    height: '100vh'
  }
});

class Post extends Component {

  mediaEmbedContent() {
    return new DOMParser()
      .parseFromString(this.props.post.media_embed.content, "text/html")
      .documentElement
      .textContent;
  }

  renderMediaEmbed() {
    const { post, classes } = this.props
    if (post && isVideo(post)) {
      const transform = (node, index) => {
        if(node.type === 'tag' && node.name === 'iframe') {
          node.attribs.height = "100%"
          node.attribs.width = "100%"
          node.attribs.class = classes.reactPlayer
        }
      }
      return <div class={classes.playerWrapper}>
        {ReactHtmlParser(this.mediaEmbedContent(), {transform})}
      </div>;
    } else {
      return <div></div>
    }
  }

  renderMediaPlayer() {
    const { post, classes } = this.props
    return <div class={classes.playerWrapper}>
      <ReactPlayer
        ref={node => this.player = node}
        playing
        url={post.url}
        className={classes.reactPlayer}
        width='100%'
        height='100%'
        onEnded={this.onMediaEnded.bind(this)}
        onError={this.onMediaError.bind(this)}
        controls={true} />
    </div>
  }

  renderMedia() {
    const { media_fallback } = this.props
    if (media_fallback) {
      return this.renderMediaEmbed()
    } else {
      return this.renderMediaPlayer()
    }
  }

  onMediaEnded() {
    const { dispatch, posts } = this.props
    dispatch(nextPost(posts))
  }

  onMediaError(error) {
    const { dispatch } = this.props
    dispatch(mediaFallback())
  }

  renderLoading() {
    return <h2>Loading...</h2>
  }

  renderEmpty() {
    return <h2>No TV Found.</h2>
  }

  render() {
    const { classes, posts, isFetching } = this.props
    if (isFetching) {
      return this.renderLoading()
    } else if (posts.length === 0) {
      return this.renderEmpty()
    } else {
      return <div style={{ opacity: isFetching ? 0.5 : 1 }}>
        <Container maxWidth={false} className={classes.root}>
          <div>{this.renderMedia()}</div>
        </Container>
        <div class={classes.spacer}></div>
      </div>
    }
  }
}

Post.propTypes = {
  post: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  const {
    dispatch,
    selectedSubreddit,
    postsBySubreddit,
    selectedPost } = state

  const {
    isFetching,
    items: posts,
  } = postsBySubreddit[selectedSubreddit] || {
    items: []
  }

  return {
    dispatch,
    posts,
    isFetching,
    post: selectedPost.post,
    media_fallback: selectedPost.media_fallback
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Post))



