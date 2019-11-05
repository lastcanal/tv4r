import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'

import Reply from './Reply'
import ReplyTree from './ReplyTree'

const commentSpacing = (depth, base = 1) => (
  Math.min(base, base / depth)
)

const styles = ({ palette, spacing, shape }) => ({
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
})

const Comment = ({ comment, depth, classes }) => {
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
  classes: PropTypes.object,
}

export default Comment |> withStyles(styles)

