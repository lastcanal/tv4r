import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({typography, spacing, palette}) => ({
  root: {
    padding: spacing(2),
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

  return <div className={classes.root}>
    <a className={classes.title} target="_BLANK" rel="noopener noreferrer" href={"https://reddit.com" + post.permalink}>
        {post.title ? post.title : ''}
    </a>
  </div>
}

export default Title

