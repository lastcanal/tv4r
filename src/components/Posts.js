import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles, useTheme } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import Skeleton from '@material-ui/lab/Skeleton'
import debounce from 'lodash.debounce'
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode'

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
  postText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
})

const classNameForTile = (selected, post, classes) => {
  if (!post?.id || !selected?.post || selected.post.id !== post.id) {
    return classes.tile
  } else {
    return `${classes.tile} ${classes.selected}`
  }
}

const style = {
  height: THUMBNAIL_HEIGHT / 2,
  width: THUMBNAIL_WIDTH,
}

const Thumbnail = ({ post }) => {
  if (post) {
    // eslint-disable-next-line camelcase
    const { thumbnail, title, over_18 } = post
    if (thumbnail === '') {
      return <ChromeReaderModeIcon fontSize="large" style={style} />
    } else if (thumbnail === 'self') {
      return <ChromeReaderModeIcon fontSize="large" style={style} />
    } else if (thumbnail === 'image') {
      return <ChromeReaderModeIcon fontSize="large" style={style} />
    } else if (thumbnail === 'default') {
      return <ChromeReaderModeIcon fontSize="large" style={style} />
    // eslint-disable-next-line camelcase
    } else if (over_18) {
      return <h2>**** NSFW ****</h2>
    } else {
      return <img src={thumbnail} alt={title} />
    }
  }

  return <Skeleton variant="rect" />
}

Thumbnail.propTypes = {
  post: PropTypes.object,
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
            <Thumbnail post={post} />
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
  const subreddit = postsBySubreddit[selectedSubreddit]
  const posts = subreddit?.[subreddit?.scope] || []
  return {
    dispatch,
    posts: mediaSelector({ posts, showImages, showVideos }),
    selected: selectedPost,
    visible: true,
    themeMode,
  }
}

export default Posts |> withStyles(styles) |> connect(mapStateToProps)
