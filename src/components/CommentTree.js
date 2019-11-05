import React from 'react'
import PropTypes from 'prop-types'

import Comment from './Comment'

const CommentTree = ({ comments }) => {
  return comments.data.children.map(
    (child, index) => <Comment comment={child} depth={0} key={index} />)
}

CommentTree.propTypes = {
  comments: PropTypes.object,
}

export default CommentTree
