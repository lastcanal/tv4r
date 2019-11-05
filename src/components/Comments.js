import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Box from '@material-ui/core/Box'
import PropTypes from 'prop-types'
import { useTheme, withStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'

import {
  fetchCommentsIfNeeded,
} from '../actions'

import CommentTree from './CommentTree'

const styles = ({ spacing, palette, shape }) => ({
  root: {
    borderRadius: shape.borderRadius,
    flexGrow: 1,
  },
  comments: {
    borderRadius: shape.borderRadius,
    flexGrow: 1,
    minHeight: ({ height }) => (height),
  },
  loading: {
    borderRadius: shape.borderRadius,
    backgroundColor: palette.background.default,
    flexGrow: 1,
    minHeight: ({ height }) => (height),
  },
  menuButton: {
    marginRight: spacing(2),
  },
  title: {
    flexGrow: 1,
    color: palette.text.contrastText,
  },
  spacerBottom: {
    minHeight: ({ height }) => (window.innerHeight - height - spacing(1)),
    paddingBottom: 1,
  },
})

const Comments = ({
  comments,
  isFetchingComments,
  post,
  height,
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
      const rootMargin = (height - spacing(2)) || 0
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
  }, [height])

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
  height: PropTypes.number,
  isFetchingComments: PropTypes.bool,
  comments: PropTypes.object,
  post: PropTypes.object,
}

const mapStateToProps = ({ postsBySubreddit, selectedSubreddit }) => {
  const { cursor } = postsBySubreddit
  const {
    items,
    comments,
    isFetchingComments,
  } = postsBySubreddit[selectedSubreddit]

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
