import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { MenuItem, ListItemIcon } from '@material-ui/core'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import { makeStyles } from '@material-ui/core/styles'

import { removeSubreddit } from '../actions'


const useStyles = makeStyles(({ palette, shape }) => ({
  root: {
    backgroundColor: palette.background.paper,
    borderRadius: shape.borderRadius,
  },
  selected: {
    backgroundColor: palette.background.default,
  },
}))

const Option = ({
  children,
  isSelected,
  onFocus,
  data,
  setValue,
  dispatch,
}) => {
  const classes = useStyles()

  const onClick = (e) => {
    e.stopPropagation()
    setValue(data)
  }

  const onRemove = (e) => {
    e.stopPropagation()
    dispatch(removeSubreddit(data.value))
  }

  return <MenuItem
    onFocus={onFocus}
    selected={isSelected}
    component="div"
    onClick={onClick}
    classes={classes}
  >
    <ListItemIcon onClick={onRemove}>
      <RemoveCircleIcon style={{ color: 'inherit' }} />
    </ListItemIcon>
    {children}
  </MenuItem>
}

Option.propTypes = {
  children: PropTypes.string,
  isFocused: PropTypes.bool,
  isSelected: PropTypes.bool,
  onFocus: PropTypes.func,
  data: PropTypes.object,
  setValue: PropTypes.func,
  dispatch: PropTypes.func,
}

export default Option |> connect()
