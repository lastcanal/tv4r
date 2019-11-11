import React, { useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import HelpIcon from '@material-ui/icons/Help'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

const Help = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const { spacing } = useTheme()

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
      <Box boxShadow={4} style={{ margin: spacing(2) }}>
        <Typography>Hello! This will be helpful later.</Typography>
      </Box>
    </Popover>
  </>

}

export default Help
