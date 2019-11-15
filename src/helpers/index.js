import { matchPath } from 'react-router-dom'
import ReactPlayer from 'react-player'

import {
  MEDIA_VIDEO,
  MEDIA_IMAGE,
  KNOWN_EMBED_REQUIRED_PROVIDERS,
} from '../constants'

import { mediaSelector } from '../selectors'

export const SUPPORTED_VIDEO_MEDIA = []
export const SUPPORTED_IMAGE_MEDIA = []

export function extractPosts (json) {
  const children = (json?.data?.children) || []
  return children.length === 0
    ? []
    : children.reduce((acc, child) => {
      if (child?.data) {
        acc.push(child.data)
      }
      return acc
    }, [])
}

export function filterPosts (posts, mediaType) {
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
  return posts?.filter(isVideo)
}

export function filterImage (posts) {
  return posts?.filter(isImage)
}

export function filterVideoImage (posts) {
  return posts?.filter((post) => {
    return (isVideo(post) || isImage(post))
  })
}

export function isVideo (post) {
  if (!post) return false
  const media = post.secure_media || post.media
  return (
    post.is_video ||
    media?.oembed?.type === 'video' ||
    ReactPlayer.canPlay(post.url)
  )
}
export function isImage (post) {
  if (!post) return false
  return !!(
    !isVideo(post) && !post.is_video && post.preview?.enabled
  )
}

export const isTwitter = (post) => (
  post?.domain === 'twitter.com'
)

export const isKnownMediaEmbed = (post) => {
  // eslint-disable-next-line camelcase
  const name = post?.secure_media?.oembed?.provider_name
  if (name) {
    return KNOWN_EMBED_REQUIRED_PROVIDERS.indexOf(name) >= 0
  } else {
    return false
  }
}

export const urlToPathname = url => (
  new URL(url).pathname
)

const matchSubredditPath = pathname => matchPath(pathname, '/r/:subreddit')

const matchPostPath = pathname =>
  matchPath(pathname, '/r/:subreddit/comments/:postId/:slug')

export const matchRedditPath = pathname =>
  matchPostPath(pathname) || matchSubredditPath(pathname)

const matchTwitterTimelinePath = pathname =>
  matchPath(pathname, '/:name')

const matchTwitterStatusPath = pathname =>
  matchPath(pathname, '/:name/status/:id')

export const matchTwitterPath = pathname =>
  matchTwitterStatusPath(pathname) ||
    matchTwitterTimelinePath(pathname)

export const getNewSubredditFromPath = (selectedSubreddit, permalink) => {
  const match = matchRedditPath(permalink)

  return match?.isExact && selectedSubreddit !== match.params.subreddit
    ? match.params.subreddit.toLowerCase()
    : selectedSubreddit
}

export const didInvalidateSubredditFromPath = (state, action) => {
  const match = matchRedditPath(action.payload.location.pathname)

  return match?.isExact &&
    state !== match.params.subreddit.toLowerCase()
}

export const translatePermalink = (permalink, selectedSubreddit) => {
  const match = matchPostPath(permalink)
  if (match && selectedSubreddit === 'all') {
    return permalink.replace(match.params.subreddit, 'all')
  } else {
    return permalink
  }
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
    return findPostById(
      state.post.id,
      mediaSelector(action)
    )
  } else if (action.posts) {
    return { index: 0, post: action.posts[0] }
  } else {
    return { index: -1, post: null }
  }
}

export const getPostImage = (post, height) => {
  if (post.preview?.enabled) {
    const parser = new DOMParser()
    const images = post.preview.images[0].resolutions
    const selectedImage = images.find((image) => image.height >= height) || {}
    const newUrl = selectedImage.url || images[images.length - 1]?.url
    if (newUrl) {
      return parser.parseFromString(newUrl, 'text/html')
        .body.textContent
    }
  }
}

export const getImageDimensions = (imgRef, height, width) => {
  if (!imgRef) { return { width: null, height: null } }
  if (imgRef.width > imgRef.height) {
    return { width, height: null }
  } else {
    return { height, width: null }
  }
}

export const getVideoDimensions = (imgRef, height, _width) => {
  if (!imgRef) { return { width: '100%', height: '100%' } }
  return { height, width: (height * (imgRef.width / imgRef.height)) }
}

export const translateVolume = (volume, change) => (
  Math.min(1, Math.max(0, volume + change))
)

export const muiThemeToRSTheme = ({ palette }) =>
  theme => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: palette.background.contrastText,
      primary25: palette.background.contrastText,
      primary50: palette.background.contrastText,
      primary75: palette.background.contrastText,
      neutral0: palette.background.primary,
      neutral5: palette.background.primary,
      neutral10: palette.background.primary,
      neutral20: palette.background.primary,
      neutral30: palette.background.primary,
      neutral40: palette.background.primary,
      neutral50: palette.background.primary,
      neutral60: palette.background.primary,
      neutral70: palette.background.primary,
      neutral80: palette.background.primary,
      neutral90: palette.background.primary,
    },
  })

export const contrastColor = (themeMode, { primary }) => (
  themeMode === 'light' ? primary.dark : primary.light
)
