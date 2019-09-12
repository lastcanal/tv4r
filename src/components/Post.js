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

function Iframe(props) {
  return (<div dangerouslySetInnerHTML={ {__html:  props.iframe ? props.iframe : ''}} />);
}

class Post extends Component {

  mediaContent() {
    return new DOMParser().
      parseFromString(this.props.post.media_embed.content, "text/html").
      documentElement.
      textContent;
  }

  renderMedia() {
    if (this.props.post && isVideo(this.props.post)) {
      return <div>{ ReactHtmlParser(this.mediaContent()) }</div>;
    } else {
      return <div></div>
    }
  }

  render() {
    return <Container fixed className={this.props.classes.root}>
      <div>{this.props.post ? this.props.post.title : 'unknown'}</div>
      <div>{this.renderMedia()}</div>
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
    post
  } = postsBySubreddit[selectedSubreddit] || {
    items: []
  }

  return {
    dispatch,
    posts,
    post: selectedPost,
  }
}

export default  connect(mapStateToProps)(withStyles(styles)(Post))



