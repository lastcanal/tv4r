import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Box from '@material-ui/core/Box'
import PropTypes from 'prop-types'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'

import { fetchCommentsIfNeeded } from '../actions'
import { MENU_OFFSET_HEIGHT } from '../constants'

const styles = ({ spacing, palette, shape }) => ({
  root: {
    borderRadius: shape.borderRadius,
    flexGrow: 1,
    margin: spacing(1),
    padding: spacing(1),
  },
  comments: {
    borderRadius: shape.borderRadius,
    flexGrow: 1,
    margin: spacing(2),
    minHeight: ({ height }) => (height),
  },
  loading: {
    borderRadius: shape.borderRadius,
    backgroundColor: palette.background.default,
    flexGrow: 1,
    margin: spacing(2),
    minHeight: ({ height }) => (height),
  },
  menuButton: {
    marginRight: spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  spacer: {
    marginTop: ({ height }) => (height),
  },
  spacerBottom: {
    minHeight: MENU_OFFSET_HEIGHT,
    paddingBottom: 1,
  },
})

const commentStyles = makeStyles(({ palette, spacing, shape }) => ({
  comment: {
    borderRadius: shape.borderRadius,
    margin: spacing(1),
    padding: spacing(1),
    paddingRight: 0,
    marginRight: spacing(0.5),
    color: palette.primary.contrastText,
  },
  comment_container: {
    backgroundColor: palette.background.paper,
  },
  comment_container_alt: {
    backgroundColor: palette.background.default,
  },
  commentBody: {
    margin: spacing(1),
    marginBottom: spacing(2),
  },
  selfPostBody: {
    margin: spacing(1),
  },
  commentAuthor: {
    margin: spacing(1),
    display: 'block',
  },
}))

const Comments = ({
  postsBySubreddit,
  selectedSubreddit,
  selected,
  dispatch,
  classes,
}) => {
  const [visible, setVisible] = useState(false)

  useEffect(
    () => {
      if (visible) {
        dispatch(fetchCommentsIfNeeded())
      }
    },
    [selected, visible, dispatch],
  )

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      // IntersectionObserver not supported (ie, node),
      // default to always visible and always loading
      // https://caniuse.com/#feat=intersectionobserver
      setVisible(true)
      return
    } else {
      /* istanbul ignore next */
      const target = document.getElementById('scroll_beacon')
      const options = {
        root: null,
        rootMargin: '500px',
        threshold: 1.0,
      }
      const onIntersection = elements => {
        if (elements[0] && elements[0].isIntersecting) {
          setVisible(true)
        } else {
          setVisible(false)
        }
      }

      const observer = new IntersectionObserver(onIntersection, options)
      observer.observe(target)

      return () => observer.unobserve(target)
    }
  }, [selectedSubreddit])

  const subreddit = postsBySubreddit[selectedSubreddit]
  const item = subreddit && subreddit.items[selected.index]
  const comments = item && item.comments

  if (!comments || subreddit.isFetchingComments) {
    return (
      <div>
        <div className={classes.spacer}>
          <div className={classes.loading}>
            <Box className={classes.selfPostBody} boxShadow={5}>
              { subreddit.isFetchingComments ? <LinearProgress /> : '' }
            </Box>
          </div>
        </div>
        <div className={classes.spacerBottom}></div>
      </div>
    )
  }

  return (
    <div>
      <div className={classes.spacer}>
        <div className={classes.comments}>
          <div className={`${classes.comment_container} ${classes.root}`}>
            {comments.map((comment, index) => (
              <CommentTree comments={comment} key={index} />
            ))}
          </div>
        </div>
      </div>
      <div className={classes.spacerBottom}></div>
    </div>
  )
}

Comments.propTypes = {
  postsBySubreddit: PropTypes.object,
  selectedSubreddit: PropTypes.string,
  selected: PropTypes.object,
  dispatch: PropTypes.func,
  classes: PropTypes.object,
  height: PropTypes.number,
}

const Comment = ({ comment, depth }) => {
  const classes = commentStyles()
  const classForDepth = depth =>
    depth % 2 === 0
      ? `${classes.comment} ${classes.comment_container}`
      : `${classes.comment} ${classes.comment_container_alt}`

  return (
    <Box
      boxShadow={depth >= 5 ? 5 : depth + 1}
      className={classForDepth(depth)}
    >
      <Reply reply={comment} depth={depth} />
      <ReplyTree replies={comment.data.replies} depth={depth + 1} />
    </Box>
  )
}

Comment.propTypes = {
  comment: PropTypes.object,
  depth: PropTypes.number,
}

const CommentTree = ({ comments }) => {
  return comments.data.children.map(
    (child, index) => <Comment comment={child} depth={0} key={index} />)
}

CommentTree.propTypes = {
  comments: PropTypes.object,
}

const ReplyTree = ({ replies, depth }) => {
  if (!replies || !replies.data) return []
  return replies.data.children.map((child, index) => (
    <Comment comment={child} depth={depth} key={index} />
  ))
}

ReplyTree.propTypes = {
  replies: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  depth: PropTypes.number,
}

const Reply = ({ reply }) => {
  const classes = commentStyles()
  switch (reply.kind) {
    case 'more':
      return <div>More</div>
    case 't1':
      return (
        <div>
          <div className={classes.commentAuthor}>
            {reply.data.author} ({reply.data.ups - reply.data.downs})
          </div>
          <div className={classes.commentBody}>{reply.data.body}</div>
        </div>
      )
    case 't3':
      return <div className={classes.selfPostBody}>
        <h2>{reply.data.title}</h2>
        {reply.data.selfText}
      </div>
    default:
      // istanbul ignore next //
      return ''
  }
}

Reply.propTypes = {
  reply: PropTypes.object,
  depth: PropTypes.number,
}

const mapStateToProps = ({ postsBySubreddit, selectedSubreddit }) => ({
  postsBySubreddit,
  selectedSubreddit,
  selected: postsBySubreddit.cursor,
  subreddit: postsBySubreddit[selectedSubreddit],
})

export default connect(mapStateToProps)(withStyles(styles)(Comments))
