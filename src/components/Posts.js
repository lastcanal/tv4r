import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import Skeleton from '@material-ui/lab/Skeleton'

import { selectPost } from '../actions'
import { contrastColor } from '../helpers'

const styles = ({ spacing, palette }) => ({
  gridList: {
    minHeight: 140,
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
  },
  tile: {
    opacity: 0.8,
    margin: spacing(1),
    marginBottom: spacing(2),
    boxShadow: `-1px -4px 4px -4px ${palette.primary.dark}`,
    outline: `thin double ${palette.primary.dark}`,
    '&:hover': {
      outline: `thick double ${palette.primary.dark}`,
    },
  },
  selected: {
    border: ({ themeMode }) => (
      `2px solid ${contrastColor(themeMode, palette)}`
    ),
    outline: ({ themeMode }) => (
      `thick double ${contrastColor(themeMode, palette)}`
    ),
    display: 'block',
  },
})

const classNameForTile = (selected, post, classes) => {
  if (!post || !post.id ||
      !selected || !selected.post ||
      selected.post.id !== post.id) {
    return classes.tile
  } else {
    return `${classes.tile} ${classes.selected}`
  }
}

const Posts = ({ posts, selected, isFetching, classes, dispatch }) => {
  const refs = {}

  const onSelectPost = (nextPost, index, e) => {
    e.preventDefault()
    dispatch(selectPost(nextPost, index))
  }

  useEffect(() => {
    if (selected && selected.post && selected.post.id) {
      const element = refs['post-' + selected.post.id]
      if (element) {
        const box = element.getBoundingClientRect()
        const parentBox = element.parentNode.getBoundingClientRect()
        const left = element.offsetLeft - (
          (parentBox.width / 2).toFixed() - (box.width / 2))
        element.parentNode.scrollTo({ left, behavior: 'smooth' })
      }
    }
  }, [selected])

  return (
    <div ref={node => (refs['posts-ref'] = node)}>
      <GridList className={classes.gridList} cols={6.1}>
        {(isFetching ? Array.from(new Array(7)) : posts).map((post, index) => {
          const id = post ? post.id : index
          return <GridListTile
            rows={1}
            className={classNameForTile(selected, post, classes)}
            key={id}
            ref={node => (post ? (refs['post-' + post.id] = node) : '')}
            onClick={onSelectPost.bind(this, post, index)}
          >
            {isFetching
              ? <Skeleton variant="rect" />
              : <img src={post.thumbnail} alt={post.title} />
            }
            <GridListTileBar
              title={isFetching ? <Skeleton /> : post.title}
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
            />
          </GridListTile>
        })}
      </GridList>
    </div>
  )
}

Posts.propTypes = {
  posts: PropTypes.array.isRequired,
  selected: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
}

const mapStateToProps = state => {
  const { dispatch, selectedSubreddit, postsBySubreddit, config } = state
  const { themeMode } = config
  const selectedPost = postsBySubreddit.cursor || {}
  const { isFetching, items: posts } = postsBySubreddit[selectedSubreddit] || {
    isFetching: false,
    items: [],
  }

  return {
    dispatch,
    posts,
    selected: selectedPost,
    visible: true,
    themeMode,
    isFetching,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Posts))
