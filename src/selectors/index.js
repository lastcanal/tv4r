import { createSelector } from 'reselect'

import { filterPosts } from '../helpers'
import { MEDIA_IMAGE, MEDIA_VIDEO } from '../constants'


export const videoMediaSelector = createSelector(
  ({ posts }) => filterPosts(posts, MEDIA_VIDEO),
  posts => posts
)

export const imageMediaSelector = createSelector(
  ({ posts }) => filterPosts(posts, MEDIA_IMAGE),
  posts => posts
)

export const allMediaSelector = createSelector(
  ({ posts }) => filterPosts(posts),
  posts => posts
)

const get = (key) => (props) => props[key]

export const mediaSelector = createSelector(
  [allMediaSelector, get('showImages'), get('showVideos')],
  (posts, showImages, showVideos) => {
    if (showImages && !showVideos) {
      return imageMediaSelector({ posts })
    }
    if (showVideos && !showImages) {
      return videoMediaSelector({ posts })
    }

    return posts
  },
)
