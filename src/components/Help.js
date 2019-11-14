import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import HelpIcon from '@material-ui/icons/Help'
import Popover from '@material-ui/core/Popover'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

const styles = ({ palette, spacing, shape }) => ({
  root: {
    margin: spacing(2),
    padding: spacing(2),
    '& ul': {
      listStyle: 'none',
      margin: spacing(0),
      padding: spacing(0),
    },
    '& li': {
      marginRight: spacing(2),
    },
    '& code': {
      fontSize: 16,
      lineHeight: 3,
      border: `1px solid ${palette.text.primary}`,
      margin: spacing(1),
      padding: spacing(1),
      marginLeft: 0,
      borderRadius: shape.borderRadius,
    },
  },
})

const Help = ({ classes }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'help-popover' : undefined
  return <>
    <IconButton
      onClick={handleClick}
      aria-describedby={id}
      aria-label="Help"
      color="inherit"
    >
      <HelpIcon />
    </IconButton>
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <Box className={classes.root}>
        <Typography>Hello! This will be helpful later.</Typography>
        <Grid container>
          <Grid item>
            <h4 id="common-shortcuts">Common Shortcuts</h4>
            <ul>
              <li><code>&gt;</code> plays next post</li>
              <li><code>&lt;</code> plays previous post</li>
              <li>
                <code>
                  SpaceBar</code> toggles play/pause
              </li>
              <li><code>a</code> Auto Advance</li>
              <li><code>f</code> Fullscreen</li>
              <li><code>Esc</code> Exit Fullscreen</li>
              <li><code>↑</code> Increase Volume</li>
              <li><code>↓</code> Decrease Volume</li>
              <li><code>←</code> Go back 5 seconds</li>
              <li><code>→</code> Go forward 10 seconds</li>
            </ul>
          </Grid>
          <Grid item>
            <h4 id="skip-to-certain-parts-of-the-video">
              Skip to certain parts of the video
            </h4>
            <ul>
              <li><code>0</code> Go to the 0% mark</li>
              <li><code>1</code> Go to the 10% mark</li>
              <li><code>2</code> Go to the 20% mark</li>
              <li><code>3</code> Go to the 30% mark</li>
              <li><code>4</code> Go to the 40% mark</li>
              <li><code>5</code> Go to the 50% mark</li>
              <li><code>6</code> Go to the 60% mark</li>
              <li><code>7</code> Go to the 70% mark</li>
              <li><code>8</code> Go to the 80% mark</li>
              <li><code>9</code> Go to the 90% mark</li>
              <li><code>End</code>    Go to the End</li>
            </ul>
          </Grid>
        </Grid>
      </Box>
    </Popover>
  </>

}

Help.propTypes = {
  classes: PropTypes.object,
}

export default Help |> withStyles(styles)
