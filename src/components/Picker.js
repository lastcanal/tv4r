import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    margin: spacing(2),
  },
}))

const useSelectStyles = makeStyles(({ spacing }) => ({
  select: {
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: spacing(1),
    },
  },
}))

const Picker = ({ value, onChange, options }) => {
  const classes = useStyles()
  const onChangeWrapper = e => onChange(e.target.value)

  return (
    <span className={classes.container}>
      <Select
        classes={useSelectStyles()}
        onChange={onChangeWrapper}
        value={value}
      >
        {options.map(option => (
          <MenuItem value={option} key={option}>
            r/{option}
          </MenuItem>
        ))}
      </Select>
    </span>
  )
}

Picker.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

export default Picker
