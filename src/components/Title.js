import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Skeleton from '@material-ui/lab/Skeleton'

const useStyles = makeStyles(({ palette }) => ({
  root: {
    flex: 1,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  title: {
    fontSize: 22,
    textDecoration: 'none',
    cursor: 'pointer',
    color: palette.text.primary,
    fontWeight: 'bold',
  },
}))

const Title = ({ post }) => {
  const classes = useStyles()
  if (!post) return ''

  return (
    <div className={classes.root}>
      {post && <a className={classes.title} href={post.url}>
        {post.title ? post.title : <Skeleton />}
      </a>
      }
    </div>
  )
}

Title.propTypes = {
  post: PropTypes.object,
}

export default Title
