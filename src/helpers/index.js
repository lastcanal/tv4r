import { MEDIA_VIDEO, MEDIA_IMAGE } from '../constants'

export const SUPPORTED_VIDEO_MEDIA = []
export const SUPPORTED_IMAGE_MEDIA = []

export function extractPosts(json) {
  // json.data?.children? ?? []
  const children = (json && json.data && json.data.children) || []
  return children.length === 0 ? [] : children.reduce((acc, child) => {
    if (child && child.data) { acc.push(child.data) }
    return acc
  }, [])
}

export function filterPosts(posts, mediaType = MEDIA_VIDEO) {
  switch (mediaType) {
    case MEDIA_VIDEO:
      return filterVideo(posts)
    case MEDIA_IMAGE:
      return filterImage(posts)
    default:
      return filterVideoImage(posts)
  }
}

export function filterVideo(posts) {
  return posts.filter(isVideo)
}

export function filterImage(posts) {
  return posts.filter(isImage)
}

export function filterVideoImage(posts) {
  return posts.filter(function(post) {
    return (isVideo(post) || isImage(post))
  })
}

export function isVideo(post) {
  const media = post.secure_media || post.media
  return (media && media.oembed.type === 'video')

}
export function isImage(post) {
  return !!(post.thumbnail &&
    !(post.thumbnail === 'self' || post.thumbnail === 'default'))
}


