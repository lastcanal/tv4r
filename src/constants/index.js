export const MEDIA_VIDEO = 'MEDIA_VIDEO'
export const MEDIA_IMAGE = 'MEDIA_IMAGE'
export const MEDIA_IMAGE_VIDEO = 'MEDIA_IMAGE_VIDEO'

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const RECEIVE_POSTS_ERROR = 'RECEIVE_POSTS_ERROR'
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'
export const REMOVE_SUBREDDIT = 'REMOVE_SUBREDDIT'

export const NEXT_POST = 'NEXT_POST'
export const PREVIOUS_POST = 'PREVIOUS_POST'
export const SELECT_POST = 'SELECT_POST'
export const MEDIA_FALLBACK = 'MEDIA_FALLBACK'

export const REQUEST_COMMENTS = 'REQUEST_COMMENTS'
export const RECEIVE_COMMENTS = 'RECEIVE_COMMENTS'
export const RECEIVE_COMMENTS_ERROR = 'RECEIVE_COMMENTS_ERROR'

export const DEFAULT_SUBREDDITS = [
  'videos',
  'documentaries',
  'politicalvideos',
  'artisanvideos',
]

export const DEFAULT_SUBREDDIT = DEFAULT_SUBREDDITS[0]

// TODO: move logic to playerSettings.isFullScreen in redux
export const MENU_OFFSET_HEIGHT = 348

