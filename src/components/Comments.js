import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import ToolBar from '@material-ui/core/ToolBar';

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import { fetchCommentsIfNeeded } from '../actions'

import Menu from './Menu'
import Posts from './Posts'

const styles = ({ spacing, palette }) => ({
  spacer: {
    height: '100vh'
  },
  comments: {
    zIndex: 1
  },
  root: {
    backgroundColor: palette.background.default,
    flexGrow: 1,
  },
  menuButton: {
    marginRight: spacing(2),
  },
  title: {
    flexGrow: 1,
  }
})


const commentStyles = makeStyles(({ palette, spacing }) => ({
  comment: {
    margin: spacing(0.5),
    padding: spacing(1),
    paddingRight: 0,
    marginRight: spacing(0.5),
  },
  comment_container: {
    borderLeft: `1px solid ${palette.primary[800]}`,
    borderBottom: `1px solid ${palette.primary[800]}`,
    backgroundColor: palette.background.paper,
    color: palette.primary.light
  },
  comment_container_alt: {
    borderLeft: `1px solid ${palette.primary[900]}`,
    borderBottom: `1px solid ${palette.primary[900]}`,
    backgroundColor: palette.background.default,
    color: palette.primary.light
  },
  commentBody: {
    margin: spacing(1)
  },
  selfPostBody: {
    margin: spacing(1)
  },
  commentAuthor: {
    margin: spacing(1),
    display: 'block',
  }

}))

const Comments = ({ postsBySubreddit, selectedSubreddit,
                    selected, classes, dispatch }) => {

  const [visible, setVisible] = useState(false)

  useEffect((selected) => {
    if (visible) {
      dispatch(fetchCommentsIfNeeded())
    }
  }, [selected, visible, dispatch])

  useEffect(() => {
    if (typeof(IntersectionObserver) === 'undefined') {
      // IntersectionObserver not supported (ie, node),
      // default to always visible and always loading
      // https://caniuse.com/#feat=intersectionobserver
      setVisible(true)
      return
    } else {
      /* istanbul ignore next */
      const target = document.getElementById('comments');
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 1.0
      }
      const onIntersection = (elements) => {
        if (elements[0] && elements[0].isIntersecting) {
          setVisible(true)
        } else {
          setVisible(false)
        }
      }

      const observer = new IntersectionObserver(onIntersection, options);
      observer.observe(target);
      return observer.unobserve
    }
  }, [])

  const item = postsBySubreddit[selectedSubreddit]
    && postsBySubreddit[selectedSubreddit].items[selected.index]
  const comments = (item && item.comments) || []

  return <div>
    <div id="comments" className={classes.comments}>
      <div className={classes.root}>
        {comments.map((post) => <CommentTree post={post} />)}
      </div>
    </div>
  </div>
}

const CommentTree = ({ post }) => {
  return post.data.children.map(child => <Comment comment={child} depth={0} />)
}

const Comment = ({ comment, depth }) => {
  const classes = commentStyles()
  const classForDepth = (depth) => (
    (depth % 2) === 0
      ? `${classes.comment} ${classes.comment_container}`
      : `${classes.comment} ${classes.comment_container_alt}`
  )

  return <div className={classForDepth(depth)}>
    <Reply reply={comment} depth={depth}/>
    <ReplyTree replies={comment.data.replies} depth={depth + 1} />
  </div>
}

const ReplyTree = ({ replies, depth }) => {
  if (!replies || !replies.data) return []
  return replies.data.children.map((child) =>
    <Comment comment={child} depth={depth} />
  )
}

const Reply = ({ reply, depth }) => {
  const classes = commentStyles()
  switch (reply.kind) {
    case 'more':
      return <div>More</div>
    case 't1':
      return <div>
        <div className={classes.commentAuthor}>
          {reply.data.author} ({reply.data.ups - reply.data.downs})
        </div>
        <div className={classes.commentBody}>
          {reply.data.body}
        </div>
      </div>
    case 't3':
      return <div className={classes.selfPostBody}><h2>{reply.data.title}</h2></div>
    default:
      return <div />
  }
}

const mapStateToProps = ({ postsBySubreddit, selectedSubreddit }) => ({
  postsBySubreddit,
  selectedSubreddit,
  selected: postsBySubreddit.cursor,
  subreddit: postsBySubreddit[selectedSubreddit]
})

export default connect(mapStateToProps)(withStyles(styles)(Comments))

