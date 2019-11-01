import { useEffect } from 'react'
import { push } from 'connected-react-router'

import { loadSubreddit } from '../actions'

const useRouteTracker = ({
  dispatch,
  postsBySubreddit,
  selectedSubreddit,
  router,
}) => {
  useEffect(() => {
    dispatch(loadSubreddit(selectedSubreddit))
  }, [selectedSubreddit, dispatch, router])

  useEffect(() => {
    if (postsBySubreddit.cursor && postsBySubreddit.cursor.post) {
      const permalink = postsBySubreddit.cursor.post.permalink
      if (permalink && permalink !== router.location.pathname) {
        dispatch(push(permalink))
      }
    }
  }, [postsBySubreddit, router])
}

export default useRouteTracker
