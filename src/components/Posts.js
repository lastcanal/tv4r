import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'

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
    boxShadow: `2px 2px 8px 0px ${palette.primary.dark}`,
    outline: `thin double ${palette.primary.dark}`,
    '&:hover': {
      outline: `thick double ${palette.primary.dark}`,
    },
  },
  selected: {
    border: ({ themeMode }) => (`2px solid ${contrastColor(themeMode, palette)}`),
    outline: ({ themeMode }) => (`thick double ${contrastColor(themeMode, palette)}`),
    display: 'block',
  },
})

const classNameForTile = (selected, post, classes) => {
  if (!selected || !selected.post || !post.id || selected.post.id !== post.id) {
    return classes.tile
  } else {
    return `${classes.tile} ${classes.selected}`
  }
}

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
        {posts.map((post, index) => {
          return <GridListTile
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
        })}
      </GridList>
    </div>
  )
}

Posts.propTypes = {
  posts: PropTypes.array.isRequired,
  selected: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
}

const mapStateToProps = state => {
  const { dispatch, selectedSubreddit, postsBySubreddit, config } = state
  const { themeMode } = config
  const selectedPost = postsBySubreddit.cursor || {}
  const { items: posts } = postsBySubreddit[selectedSubreddit] || {
    items: [],
  }

  return {
    dispatch,
    posts,
    selected: selectedPost,
    visible: true,
    themeMode,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Posts))
