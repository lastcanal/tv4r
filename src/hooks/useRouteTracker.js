import { useEffect } from 'react'
import { push } from 'connected-react-router'

import { loadSubreddit } from '../actions'
import { translatePermalink } from '../helpers'

const useRouteTracker = ({
  dispatch,
  postsBySubreddit,
  selectedSubreddit,
  router,
}) => {
  useEffect(() => {
    dispatch(loadSubreddit(selectedSubreddit))
  }, [selectedSubreddit])

  useEffect(() => {
    if (postsBySubreddit.cursor && postsBySubreddit.cursor.post) {
      const permalink = postsBySubreddit.cursor.post.permalink
      const newPermalink = translatePermalink(permalink, selectedSubreddit)
      if (newPermalink && newPermalink !== router.location.pathname) {
        dispatch(push(newPermalink))
      }
    }
  }, [postsBySubreddit, router])
}

export default useRouteTracker
