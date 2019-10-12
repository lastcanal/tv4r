import React, { Component } from 'react'
import { connect } from 'react-redux'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { selectPost } from '../actions'

const tileStyle = {
  marginTop: 24,
  marginBottom: 60,
  marginLeft: 12,
  marginRight: 12,
  backgroundColor: 'black',
  overflow: 'hidden',
  borderRadius: 26,
}

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  gridList: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
  },
  title: {
    color: '#eee',
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  tileSelected: {
    opacity: 1,
    border: "7px solid #000",
    ...tileStyle
  },
  tile: {
    opacity: 0.8,
    border: "7px solid #eee",
    ...tileStyle
  }
});

class Posts extends Component {

  onSelectPost(nextPost, index, e) {
    e.preventDefault()
    this.props.dispatch(selectPost(nextPost, index))
  }

  componentWillReceiveProps(nextProps) {
    const post = nextProps.selectedPost.post
    if (!post || (post.id === null && typeof(post.id) === 'undefined'))
      return false;
    this.scrollIntoView(post)
  }

  scrollIntoView(post) {
    const element = this['post-' + post.id]
    if (element) {
      const box = element.parentNode.getBoundingClientRect()
      element.parentNode.scrollLeft = element.offsetLeft - (box.width / Math.PI)
    }
  }

  render() {
    const {posts, selectedPost, classes} = this.props
    return (
      <div ref={node => this['posts-ref'] = node} className={classes.root}>
        <GridList className={classes.gridList} cols={4.38} >
          {posts.map((post, index) => {
            return <GridListTile
              className={classNameForTile(selectedPost, post, classes)}
              key={post.id}
              ref={node => this['post-' + post.id] = node}
              onClick={this.onSelectPost.bind(this, post, index)}>
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
          })}
        </GridList>
      </div>
    );
  }
}

const classNameForTile = (selectedPost, post, classes) => {
  if (!selectedPost || !selectedPost.post || !post.id) return classes.tile
  return selectedPost.post.id === post.id
    ? classes.tileSelected
    : classes.tile
}

Posts.propTypes = {
  posts: PropTypes.array.isRequired,
  selectedPost: PropTypes.object.isRequired,
}

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
    selectedPost,
    visible: true
  }
}

export default  connect(mapStateToProps)(withStyles(styles)(Posts))

