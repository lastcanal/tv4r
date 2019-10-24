import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { MenuItem, ListItemIcon } from '@material-ui/core'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'

// import { removeSubreddit } from '../actions'

const Option = ({ children, isSelected, onFocus, data, setValue, dispatch: _ }) => {
  const onClick = () => {
    setValue(data)
  }

  const onRemove = (e) => {
    e.preventDefault()
    // dispatch(removeSubreddit(data.value))
    return false
  }

  return <MenuItem
    onFocus={onFocus}
    selected={isSelected}
    component="div"
  >
    <ListItemIcon onClick={onRemove}>
      <RemoveCircleIcon />
    </ListItemIcon>
    <div onClick={onClick}>
      {children}
    </div>
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

export default connect()(Option)
