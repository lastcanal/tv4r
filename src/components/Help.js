import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import HelpIcon from '@material-ui/icons/Help'
import Popover from '@material-ui/core/Popover'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

const styles = ({ palette, spacing, shape }) => ({
  root: {
    minHeight: '100vh',
    flexGrow: 1,
    backgroundColor: palette.background.paper,
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
    '& a': {
      color: palette.text.primary,
      margin: spacing(1),
    },
  },
})

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const TabPanel = (props) => {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  )
}

TabPanel.propTypes = {
  children: PropTypes.array,
  value: PropTypes.string,
  index: PropTypes.number,
}

const Help = ({ classes }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [value, setValue] = React.useState(0)

  const handleChange = (_event, newValue) => {
    setValue(newValue)
  }

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
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Help Tabs"
          >
            <Tab label="Keyboard Controls" {...a11yProps(0)} />
            <Tab label="About" {...a11yProps(1)} />
            <Tab label="Thanks" {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
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
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography>Hello! This will be more helpful later.</Typography>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography variant="h7">
          This app relies on the following packages:
          </Typography>

          <ul>
            <li><a href="https://www.npmjs.com/package/connected-react-router">connected-react-router</a></li>
            <li><a href="https://www.npmjs.com/package/es6-promise">es6-promise</a></li>
            <li><a href="https://www.npmjs.com/package/isomorphic-fetch">isomorphic-fetch</a></li>
            <li><a href="https://www.npmjs.com/package/lodash.debounce">lodash.debounce</a></li>
            <li><a href="https://www.npmjs.com/package/lodash.throttle">lodash.throttle</a></li>
            <li><a href="https://www.npmjs.com/package/loglevel">loglevel</a></li>
            <li><a href="https://www.npmjs.com/package/pretty">pretty</a></li>
            <li><a href="https://www.npmjs.com/package/prop-types">prop-types</a></li>
            <li><a href="https://www.npmjs.com/package/react">react</a></li>
            <li><a href="https://www.npmjs.com/package/react-dom">react-dom</a></li>
            <li><a href="https://www.npmjs.com/package/react-html-parser">react-html-parser</a></li>
            <li><a href="https://www.npmjs.com/package/react-player">react-player</a></li>
            <li><a href="https://www.npmjs.com/package/react-redux">react-redux</a></li>
            <li><a href="https://www.npmjs.com/package/react-router-dom">react-router-dom</a></li>
            <li><a href="https://www.npmjs.com/package/react-scripts">react-scripts</a></li>
            <li><a href="https://www.npmjs.com/package/react-select">react-select</a></li>
            <li><a href="https://www.npmjs.com/package/react-twitter-widgets">react-twitter-widgets</a></li>
            <li><a href="https://www.npmjs.com/package/recompose">recompose</a></li>
            <li><a href="https://www.npmjs.com/package/redux">redux</a></li>
            <li><a href="https://www.npmjs.com/package/redux-devtools-extension">redux-devtools-extension</a></li>
            <li><a href="https://www.npmjs.com/package/redux-logger">redux-logger</a></li>
            <li><a href="https://www.npmjs.com/package/redux-persist">redux-persist</a></li>
            <li><a href="https://www.npmjs.com/package/redux-thunk">redux-thunk</a></li>
            <li><a href="https://www.npmjs.com/package/remote-redux-devtools">remote-redux-devtools</a></li>
            <li><a href="https://www.npmjs.com/package/reselect">reselect</a></li>
            <li><a href="https://www.npmjs.com/package/screenfull">screenfull</a></li>
          </ul>
        </TabPanel>
      </Box>
    </Popover>
  </>

}

Help.propTypes = {
  classes: PropTypes.object,
}

export default Help |> withStyles(styles)
