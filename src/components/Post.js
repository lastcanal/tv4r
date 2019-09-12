import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {Box, Grid, Container} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import {isVideo} from '../helpers'
import ReactHtmlParser from 'react-html-parser';
import ReactPlayer from 'react-player'

import { nextPost, previousPost, mediaFallback } from '../actions'

class Post extends Component {

  mediaEmbedContent() {
    return new DOMParser().
      parseFromString(this.props.post.media_embed.content, "text/html").
      documentElement.
      textContent;
  }

  renderMediaEmbed() {
    if (this.props.post && isVideo(this.props.post)) {
      return <div>{ ReactHtmlParser(this.mediaEmbedContent()) }</div>;
    } else {
      return <div></div>
    }
  }

  renderMediaPlayer() {
    const { post } = this.props
    return <ReactPlayer
      playing
      url={post.url}
      height={post.media.oembed.height}
      height="800px"
      width="100%"
      onEnded={this.onMediaEnded.bind(this)}
      onError={this.onMediaError.bind(this)}
      controls={true} />
  }

  renderMedia() {
    const { post, media_fallback } = this.props
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
    console.log('media error', error)
    const { dispatch } = this.props
    dispatch(mediaFallback())
  }

  render() {
    const { classes, post } = this.props
    return <Container maxWidth="xl" className={classes.root}>
      <div>{this.renderMedia()}</div>
      <h1>
         {post ? post.title : 'unknown'}
      </h1>
      <a target="_BLANK" href={"https://reddit.com" + post.permalink}>
        {post.num_comments} Comment{post.num_comments > 0 ? 's' : ''}
      </a>
    </Container>
  }
}

Post.propTypes = {
  post: PropTypes.object.isRequired
}

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    border: "10px solid black",
  },
});

const mapStateToProps = state => {
  const { dispatch, selectedSubreddit, postsBySubreddit, selectedPost } = state
  const {
    items: posts,
  } = postsBySubreddit[selectedSubreddit] || {
    items: []
  }

  return {
    dispatch,
    posts,
    post: selectedPost.post,
    media_fallback: selectedPost.media_fallback
  }
}

export default  connect(mapStateToProps)(withStyles(styles)(Post))



