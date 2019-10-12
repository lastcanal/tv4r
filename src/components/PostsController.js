import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import RefreshIcon from '@material-ui/icons/Refresh';

import { DEFAULT_SUBREDDITS } from '../constants'
import Picker from './Picker'

const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    width: '100%',
    marginTop: 20,
    backgroundColor: '#eee',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: '16%',
    marginLeft: 6,
    marginRight: 6
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  title: {
    fontSize: "28px",
  },
  comments: {
    color: 'grey',
    paddingLeft: 10
  },
  titleContainer: {
  }
}));

const PostsController = ({parent}) => {
  const { selectedSubreddit, post } = parent.props
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <div className={classes.details} style={{ flex: 1 }}>
        <div className={classes.controls}>
          <IconButton aria-label="previous" color="inherit" onClick={parent.handlePreviousClick}>
            <SkipPreviousIcon />
          </IconButton>
          <IconButton aria-label="refresh" color="inherit" onClick={parent.handleRefreshClick}>
            <RefreshIcon />
          </IconButton>
          <IconButton aria-label="next" color="inherit" onClick={parent.handleNextClick}>
            <SkipNextIcon />
          </IconButton>
          <Picker value={selectedSubreddit}
                  onChange={parent.handleChangeSubreddit}
                  options={DEFAULT_SUBREDDITS} />
        </div>
        <CardContent className={classes.content}>
          {post
            ? <div class={classes.titleContainer}>
                <span class={classes.title}>
                  {post ? post.title : ''}
                </span>
                <a target="_BLANK" rel="noopener noreferrer" href={"https://reddit.com" + post.permalink}>
                  <span class={classes.comments}>{post.num_comments} Comment{post.num_comments > 0 ? 's' : ''}</span>
                </a>
              </div>
            : ''}
          <Typography variant="subtitle1" color="textSecondary">
            {post && post.author_fullname}
          </Typography>
        </CardContent>
      </div>
    </Card>
  );
}

export default PostsController

