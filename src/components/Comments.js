import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Box from '@material-ui/core/Box'
import PropTypes from 'prop-types'
import { withStyles, useTheme } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import CircularProgress from '@material-ui/core/CircularProgress'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'

import {
  fetchCommentsIfNeeded,
  fetchRepliesIfNeeded,
} from '../actions'

import { postURL } from '../helpers/reddit'

const commentsStyles = ({ spacing, palette, shape }) => ({
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

const commentSpacing = (depth, base = 1) => (
  Math.min(base, base / depth)
)

const commentStyles = ({ palette, spacing, shape }) => ({
  comment: {
    borderRadius: shape.borderRadius,
    padding: spacing(1),
    margin: spacing(1),
    paddingRight: 0,
    marginBottom: ({ depth }) => (
      spacing(commentSpacing(depth, 1))
    ),
    marginLeft: ({ depth }) => (
      spacing(commentSpacing(depth, 0.61))
    ),
    marginRight: ({ depth }) => (
      spacing(commentSpacing(depth, 0.61))
    ),
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
    display: 'inline',
    color: palette.text.primary,
  },
  postTitle: {
    color: palette.text.primary,
    textDecoration: 'none',
  },
})

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

const MoreButton = ({ children, onClick }) => {
  return <a style={{
    display: 'flex',
    cursor: 'pointer' }
  } onClick={onClick}>
    {children}
  </a>
}

MoreButton.propTypes = {
  children: PropTypes.object,
  onClick: PropTypes.func,
}

const _Comments = ({
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

_Comments.propTypes = {
  dispatch: PropTypes.func,
  classes: PropTypes.object,
  height: PropTypes.number,
  isFetchingComments: PropTypes.bool,
  comments: PropTypes.object,
  post: PropTypes.object,
}

const Comments = _Comments |>
  withStyles(commentsStyles) |>
  connect(mapStateToProps)

const _Comment = ({ comment, depth, classes }) => {
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

_Comment.propTypes = {
  comment: PropTypes.object,
  depth: PropTypes.number,
  classes: PropTypes.object,
}

const Comment = _Comment |> withStyles(commentStyles)

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

const _Reply = ({ reply, dispatch, comments, classes }) => {
  const { data } = reply
  const [show, setShow] = useState(true)
  const [loading, setLoading] = useState(false)

  const loadReplies = () => {
    setShow(true)
    setLoading(true)
    dispatch(fetchRepliesIfNeeded(reply))
    return false
  }

  const hideReplies = () => {
    setLoading(false)
    setShow(false)
  }

  switch (reply.kind) {
    case 'more':
      const parentId = reply.data.parent_id
      const comment = comments[parentId]
      if (show && comment) {
        return <>
          <MoreButton onClick={hideReplies}>
            <RemoveIcon />
          </MoreButton>
          {show && <ReplyTree replies={comment} depth={5} key={parentId} />}
        </>
      } else if (loading) {
        return <MoreButton>
          <CircularProgress size={24} thuckness={10} />
        </MoreButton>
      } else {
        return <MoreButton onClick={loadReplies}>
          <AddIcon />
        </MoreButton>
      }

    case 't1':
      const voteTotal = data.ups - data.downs
      return (
        <>
          <div>
            <a
              className={classes.commentAuthor}
              href={postURL(reply.data.permalink, 'html')}
            >
              {reply.data.author}
            </a>
            ({voteTotal > 0 ? `+${voteTotal}` : voteTotal})
          </div>
          <div className={classes.commentBody}>{data.body}</div>
        </>
      )
    case 't3':
      return <div className={classes.selfPostBody}>
        <a
          className={classes.postTitle}
          href={postURL(reply.data.permalink, 'html')}
        >
          <h2>{data.title}</h2>
        </a>
        {data.selfText}
      </div>
    default:
      // istanbul ignore next //
      return ''
  }
}

_Reply.propTypes = {
  reply: PropTypes.object,
  depth: PropTypes.number,
  dispatch: PropTypes.func,
}

const Reply = _Reply |>
  withStyles(commentStyles) |>
  connect(mapStateToProps)

export default Comments
