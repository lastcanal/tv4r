import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles, useTheme } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import Skeleton from '@material-ui/lab/Skeleton'
import debounce from 'lodash.debounce'

import { selectPost } from '../actions'
import { contrastColor } from '../helpers'
import { mediaSelector } from '../selectors'

import { THUMBNAIL_HEIGHT, THUMBNAIL_WIDTH } from '../constants'

const styles = ({ spacing, palette }) => ({
  gridList: {
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
  if (!post?.id || !selected?.post || selected.post.id !== post.id) {
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

  const { spacing } = useTheme()

  useEffect(() => {
    if (selected?.post?.id) {
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

  const calculateColumns = () => (
    window.innerWidth / (THUMBNAIL_WIDTH + spacing(2))
  )

  const [columns, setColumns] = useState(calculateColumns())

  const onResize = debounce(() => {
    setColumns(calculateColumns())
  }, 10)

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => (window.removeEventListener('resize', onResize))
  }, [])

  const postsIter = posts.length === 0
    ? Array.from(new Array(14))
    : posts

  return (
    <div ref={node => (refs['posts-ref'] = node)}>
      <GridList
        className={classes.gridList}
        cellHeight={THUMBNAIL_HEIGHT}
        cols={columns}
      >
        {postsIter.map((post, index) => {
          const id = post ? post.id : index
          return <GridListTile
            rows={1}
            className={classNameForTile(selected, post, classes)}
            key={id}
            ref={node => (post ? (refs['post-' + post.id] = node) : '')}
            onClick={onSelectPost.bind(this, post, index)}
          >
            {post && post.thumbnail
              ? <img src={post.thumbnail} alt={post.title} />
              : post && post.title
                ? ''
                : <Skeleton variant="rect" />
            }
            <GridListTileBar
              title={post ? post.title : <Skeleton />}
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
  const { themeMode, showImages, showVideos } = config
  const selectedPost = postsBySubreddit.cursor || {}
  const { items: posts } = postsBySubreddit[selectedSubreddit] || {
    items: [],
  }

  return {
    dispatch,
    posts: mediaSelector({ posts, showImages, showVideos }),
    selected: selectedPost,
    visible: true,
    themeMode,
  }
}

export default Posts |> withStyles(styles) |> connect(mapStateToProps)
