import React, { useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'

import { fetchRepliesIfNeeded } from '../actions'
import { postURL } from '../helpers/reddit'
import { mediaSelector } from '../selectors'

import ReplyTree from './ReplyTree'

const styles = ({ palette, spacing }) => ({
  commentBody: {
    margin: spacing(1),
    marginBottom: spacing(2),
    overflowWrap: 'break-word',
  },
  selfPostBody: {
    margin: spacing(1),
    '& a': {
      color: palette.text.primary,
    },
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

const Reply = ({ reply, depth, dispatch, comments, classes }) => {
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

  const selfTextContent = () => {
    if (!data.selftext_html) return ''
    return new DOMParser().parseFromString(
      data.selftext_html,
      'text/html',
    ).documentElement.textContent
  }

  const renderSelfText = () => {
    return ReactHtmlParser(selfTextContent())
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
          {show &&
            <ReplyTree replies={comment} depth={depth + 1} key={parentId} />}
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
        {renderSelfText()}
        {data.selfText}
      </div>
    default:
      // istanbul ignore next //
      return ''
  }
}

Reply.propTypes = {
  reply: PropTypes.object,
  depth: PropTypes.number,
  dispatch: PropTypes.func,
}

export const mapStateToProps = ({
  postsBySubreddit,
  selectedSubreddit,
  config,
}) => {
  const { showVideos, showImages, showNSFW } = config
  const { cursor } = postsBySubreddit
  const subreddit = postsBySubreddit[selectedSubreddit]
  const comments = subreddit.comments || {}
  const posts = subreddit[subreddit.scope]
  const items = mediaSelector({ posts, showVideos, showImages, showNSFW })
  const post = items[cursor.index]
  const commentsForPost = comments[post?.id]

  return {
    comments: commentsForPost,
  }
}

export default Reply |>
  withStyles(styles) |>
  connect(mapStateToProps)
