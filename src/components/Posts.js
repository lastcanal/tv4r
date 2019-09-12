import React, { Component } from 'react'
import { connect } from 'react-redux'

import PropTypes from 'prop-types'
import {Box, Grid} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { selectPost } from '../actions'

import Post from './Post'

class Posts extends Component {
//const Posts = ({posts}) => {

  onSelectPost(nextPost, e) {
    e.preventDefault()

    const { dispatch } = this.props
    this.props.dispatch(selectPost(nextPost))
  }

  render() {
    const {posts, classes} = this.props
    return (
      <div className={classes.root}>
        <Post />
        <GridList className={classes.gridList} cols={7} cellHeight={140}>
          {posts.map(post => (
            <GridListTile key={post.id} onClick={this.onSelectPost.bind(this, post)}>
              <img src={post.thumbnail} alt={post.title} />
              <GridListTileBar
                title={post.title}
                classes={{
                  root: classes.titleBar,
                  title: classes.title,
                }}
                actionIcon={
                  <div>"hi"</div>
                }
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  }

}

Posts.propTypes = {
  posts: PropTypes.array.isRequired,
  post: PropTypes.object.isRequired,
}

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  title: {
    color: 'white'
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
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
    post: selectedPost,
  }
}

export default  connect(mapStateToProps)(withStyles(styles)(Posts))

