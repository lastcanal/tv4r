import { matchPath } from 'react-router-dom'
import { MEDIA_VIDEO, MEDIA_IMAGE } from '../constants'

export const SUPPORTED_VIDEO_MEDIA = []
export const SUPPORTED_IMAGE_MEDIA = []

export function extractPosts (json) {
  // json.data?.children? ?? []
  const children = (json && json.data && json.data.children) || []

  return children.length === 0
    ? []
    : children.reduce((acc, child) => {
      if (child && child.data) {
        acc.push(child.data)
      }
      return acc
    }, [])
}

export function filterPosts (posts, mediaType = MEDIA_VIDEO) {
  switch (mediaType) {
    case MEDIA_VIDEO:
      return filterVideo(posts)
    case MEDIA_IMAGE:
      return filterImage(posts)
    default:
      return filterVideoImage(posts)
  }
}

export function filterVideo (posts) {
  return posts.filter(isVideo)
}

export function filterImage (posts) {
  return posts.filter(isImage)
}

export function filterVideoImage (posts) {
  return posts.filter(function (post) {
    return isVideo(post) || isImage(post)
  })
}

export function isVideo (post) {
  const media = post.secure_media || post.media
  return media && media.oembed && media.oembed.type === 'video'

}
export function isImage (post) {
  return !!(
    post && post.thumbnail &&
    !(post.thumbnail === 'self' || post.thumbnail === 'default')
  )
}

const matchSubredditPath = pathname => matchPath(pathname, '/r/:subreddit')

const matchPostPath = pathname =>
  matchPath(pathname, '/r/:subreddit/comments/:postId/:slug')

export const matchRedditPath = pathname =>
  matchPostPath(pathname) || matchSubredditPath(pathname)

export const getNewSubredditFromPath = (state, action) => {
  const match = matchRedditPath(action.payload.location.pathname)

  return match && match.isExact && state !== match.params.subreddit
    ? match.params.subreddit.toLowerCase()
    : state
}

export const didInvalidateSubredditFromPath = (state, action) => {
  const match = matchRedditPath(action.payload.location.pathname)

  return match && match.isExact && state !== match.params.subreddit.toLowerCase()
}

export const findPostById = (postId, posts) => {
  const index = posts.findIndex(post => post.id === postId)

  if (index >= 0) {
    return { index, post: posts[index] }
  } else if (posts[0]) {
    return { index: 0, post: posts[0] }
  } else {
    return { index: -1, post: { id: postId } }
  }
}

export const extractPost = (state, action) => {
  if (action.index >= 0) {
    return { index: action.index, post: action.post }
  } else if (action.posts && state.post && state.post.id) {
    return findPostById(state.post.id, action.posts)
  } else {
    return { index: -1, post: null }
  }
}
