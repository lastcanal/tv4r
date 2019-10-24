import React, { useEffect } from 'react'

import { connect } from 'react-redux'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import { selectPost } from '../actions'

const tileStyles = ({ spacing, shape }) => ({
  margin: spacing(1),
  overflow: 'hidden',
  borderRadius: shape.borderRadius,
})

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
    color: theme.palette.primary.contrastText,
  },
  tileSelected: {
    opacity: 1,
    border: `2px solid ${theme.palette.primary.main}`,
    ...tileStyles(theme),
  },
  tile: {
    opacity: 0.8,
    ...tileStyles(theme),
  },
})

const Posts = ({ posts, selected, classes, dispatch }) => {
  const refs = {}

  const onSelectPost = (nextPost, index, e) => {
    e.preventDefault()
    dispatch(selectPost(nextPost, index))
  }

  useEffect(() => {
    if (selected && selected.post && selected.post.id) {
      const element = refs['post-' + selected.post.id]
      if (element) {
        const box = element.parentNode.getBoundingClientRect()
        element.parentNode.scrollLeft = element.offsetLeft - box.width / Math.PI
      }
    }
  }, [selected])

  return (
    <div ref={node => (refs['posts-ref'] = node)} className={classes.root}>
      <GridList className={classes.gridList} cols={6.1}>
        {posts.map((post, index) => {
          return (
            <GridListTile
              rows={1}
              className={classNameForTile(selected, post, classes)}
              key={post.id}
              ref={node => (refs['post-' + post.id] = node)}
              onClick={onSelectPost.bind(this, post, index)}
            >
              <img src={post.thumbnail} alt={post.title} />
              <GridListTileBar
                title={post.title}
                classes={{
                  root: classes.titleBar,
                  title: classes.title,
                }}
              />
            </GridListTile>
          )
        })}
      </GridList>
    </div>
  )
}

const classNameForTile = (selected, post, classes) => {
  if (!selected || !selected.post || !post.id) return classes.tile
  return selected.post.id === post.id ? classes.tileSelected : classes.tile
}

Posts.propTypes = {
  posts: PropTypes.array.isRequired,
  selected: PropTypes.object.isRequired,
}

const mapStateToProps = state => {
  const { dispatch, selectedSubreddit, postsBySubreddit } = state

  const selectedPost = postsBySubreddit.cursor || {}

  const { items: posts } = postsBySubreddit[selectedSubreddit] || {
    items: [],
  }

  return {
    dispatch,
    posts,
    selected: selectedPost,
    visible: true,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Posts))
