import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({typography, spacing, palette}) => ({
  root: {
    padding: spacing(2),
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  title: {
    fontSize: 22,
    textDecoration: 'none',
    cursor: 'pointer',
    color: palette.text.primary,
  },
}));

const Title = ({ post }) => {
  const classes = useStyles()
  if (!post) return ''

  return <div class={classes.root}>
    <a class={classes.title} target="_BLANK" rel="noopener noreferrer" href={"https://reddit.com" + post.permalink}>
        {post ? post.title : ''}
    </a>
  </div>
}

export default Title
