import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    padding: spacing(2),
  },
  title: {
    fontSize: 22,
    textDecoration: 'none',
    cursor: 'pointer',
    color: palette.text.primary,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
}))

const Title = ({ post }) => {
  const classes = useStyles()
  if (!post) return ''

  return (
    <div className={classes.root}>
      <a
        className={classes.title}
        target="_BLANK"
        rel="noopener noreferrer"
        href={'https://reddit.com' + post.permalink}
      >
        {post.title ? post.title : ''}
      </a>
    </div>
  )
}

Title.propTypes = {
  post: PropTypes.object,
}

export default Title
