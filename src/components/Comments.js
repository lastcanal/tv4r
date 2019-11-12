import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Box from '@material-ui/core/Box'
import PropTypes from 'prop-types'
import { useTheme, withStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import { mediaSelector } from '../selectors'

import {
  fetchCommentsIfNeeded,
} from '../actions'

import CommentTree from './CommentTree'

const styles = ({ spacing, palette, shape }) => ({
  root: {
    borderRadius: shape.borderRadius,
  },
  comments: {
    borderRadius: shape.borderRadius,
    minHeight: ({ playerHeight }) => (playerHeight),
  },
  loading: {
    borderRadius: shape.borderRadius,
    backgroundColor: palette.background.default,
    minHeight: ({ playerHeight }) => (playerHeight),
  },
  menuButton: {
    marginRight: spacing(2),
  },
  title: {
    color: palette.text.contrastText,
  },
  spacerBottom: {
    minHeight: ({ menuHeight }) => (menuHeight + spacing(1)),
    paddingBottom: 1,
  },
})

const Comments = ({
  comments,
  isFetchingComments,
  post,
  playerHeight,
  dispatch,
  classes,
}) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (visible) {
      dispatch(fetchCommentsIfNeeded())
    }
  }, [post, visible])

  const { spacing } = useTheme()

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      // IntersectionObserver not supported (ie, node),
      // default to always visible and always loading
      // https://caniuse.com/#feat=intersectionobserver
      setVisible(true)
      return
    } else {
      /* istanbul ignore next */
      const rootMargin = (playerHeight - spacing(2)) || 0
      const target = document.getElementById('scroll_beacon')
      const options = {
        rootMargin: `${rootMargin}px`,
        threshold: 1,
      }
      const onIntersection = elements => {
        if (elements[0] && elements[0].isIntersecting) {
          setVisible(true)
        } else {
          setVisible(false)
        }
      }

      const observer = new IntersectionObserver(onIntersection, options)
      if (target) {
        observer.observe(target)
        return () => observer.unobserve(target)
      }
    }
  }, [playerHeight])

  if (!comments || isFetchingComments) {
    return (
      <div>
        <div className={classes.spacer}>
          <div id="comments" className={classes.loading}>
            <Box className={classes.selfPostBody} boxShadow={5}>
              { isFetchingComments ? <LinearProgress /> : '' }
            </Box>
          </div>
        </div>
        <div className={classes.spacerBottom}></div>
      </div>
    )
  }

  return (
    <div>
      <div className={classes.comments}>
        <div
          id="comments"
          className={`${classes.comment_container} ${classes.root}`}
        >
          {comments.root.map((comment, index) => (
            <CommentTree comments={comment} key={index} />
          ))}
        </div>
      </div>
      <div className={classes.spacerBottom}></div>
    </div>
  )
}

Comments.propTypes = {
  dispatch: PropTypes.func,
  classes: PropTypes.object,
  playerHeight: PropTypes.number,
  menuHeight: PropTypes.number,
  isFetchingComments: PropTypes.bool,
  comments: PropTypes.object,
  post: PropTypes.object,
}

const mapStateToProps = ({ postsBySubreddit, selectedSubreddit, config }) => {
  const { showVideos, showImages, showNSFW } = config
  const { cursor } = postsBySubreddit
  const subreddit = postsBySubreddit[selectedSubreddit]
  const {
    comments,
    isFetchingComments,
    scope,
  } = subreddit

  const posts = subreddit[scope]
  const items = mediaSelector({ posts, showVideos, showImages, showNSFW })
  const post = items[cursor.index]
  const commentsForPost = comments?.[post?.id]

  return {
    post,
    isFetchingComments,
    comments: commentsForPost,
  }
}

export default Comments |>
  withStyles(styles) |>
  connect(mapStateToProps)
