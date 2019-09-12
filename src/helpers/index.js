import { MEDIA_VIDEO, MEDIA_IMAGE, MEDIA_IMAGE_VIDEO } from '../constants'

export const SUPPORTED_VIDEO_MEDIA = []
export const SUPPORTED_IMAGE_MEDIA = []

export function filterPosts(posts) {
  console.log(posts)
  return filterVideo(posts)
//switch (mediaType) {
//  case MEDIA_VIDEO:
//    return filterVideo(posts)
//  case MEDIA_IMAGE:
//    return filterImage(posts)
//  default:
//    return filterVideoImage(posts)
//}
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
  return !!post.secure_media_embed.media_domain_url
}
export function isImage(post) {
  return !!(post.thumbnail &&
    !(post.thumbnail === 'self' || post.thumbnail === 'default'))
}
