import { createSelector } from 'reselect'

import { filterPosts } from '../helpers'
import { MEDIA_IMAGE, MEDIA_VIDEO } from '../constants'

export const allPostsSelector = createSelector(
  ({ posts }) => posts,
  posts => posts
)

export const allMediaSelector = createSelector(
  ({ posts }) => filterPosts(posts),
  posts => posts
)

export const videoMediaSelector = createSelector(
  ({ posts }) => filterPosts(allMediaSelector({ posts }), MEDIA_VIDEO),
  posts => posts
)

export const imageMediaSelector = createSelector(
  ({ posts }) => filterPosts(allMediaSelector({ posts }), MEDIA_IMAGE),
  posts => posts
)

const get = (key) => (props) => props[key]

export const mediaSelector = createSelector(
  [allPostsSelector, get('showImages'), get('showVideos')],
  (posts, showImages, showVideos) => {
    if (showImages && showVideos) {
      return allMediaSelector({ posts })
    } else if (showImages && !showVideos) {
      return imageMediaSelector({ posts })
    } else if (showVideos && !showImages) {
      return videoMediaSelector({ posts })
    } else if (!showVideos && !showImages) {
      return posts
    }
  },
)
