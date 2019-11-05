import React from 'react'
import PropTypes from 'prop-types'

import Comment from './Comment'

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

export default ReplyTree
