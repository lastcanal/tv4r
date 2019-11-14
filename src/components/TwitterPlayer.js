import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Tweet, Timeline } from 'react-twitter-widgets'

import { nextPost } from '../actions'
import { matchTwitterPath, urlToPathname } from '../helpers'

const styles = () => ({
  playerWrapper: {
    height: ({ height }) => height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    overflow: 'hidden',
    top: 0,
    left: 0,
    transform: 'translate3d(0,0,1px)',
    '& iframe': {
      border: 0,
    },
  },
})

const TwitterPlayer = ({
  post,
  height,
  isAutoAdvance,
  themeMode,
  dispatch,
  classes,
}) => {

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isAutoAdvance) dispatch(nextPost())
    }, 5000)

    return () => clearTimeout(timeout)
  }, [post, isAutoAdvance])

  const { name, id } = useMemo(() => (
    matchTwitterPath(urlToPathname(post.url))?.params || {}
  ))

  const Player = () => {
    if (typeof id !== 'undefined') {
      return <Tweet
        tweetId={id}
        options={{
          theme: themeMode,
        }}
      />
    } else if (typeof name !== 'undefined') {
      return <Timeline
        dataSource={{
          sourceType: 'profile',
          screenName: name,
        }}
        options={{
          username: name,
          theme: themeMode,
          height: height,
        }}
      />
    } else {
      return ''
    }
  }

  return <div className={classes.playerWrapper}>
    <Player />
  </div>
}

TwitterPlayer.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
  error: PropTypes.object,
  isFetching: PropTypes.bool,
  isAutoAdvance: PropTypes.bool,
  themeMode: PropTypes.string,
  height: PropTypes.number,
  post: PropTypes.object,
}

const mapStateToProps = state => {
  const { dispatch, selectedSubreddit, postsBySubreddit, config } = state
  const { isFullsceen, isAutoAdvance, themeMode } = config
  const selectedPost = postsBySubreddit.cursor || {}
  const { isFetching } = postsBySubreddit[selectedSubreddit] || {
    isFetching: false,
  }

  return {
    dispatch,
    isFetching,
    post: selectedPost.post,
    isFullsceen,
    themeMode,
    isAutoAdvance,
  }
}

export default TwitterPlayer |> connect(mapStateToProps) |> withStyles(styles)

