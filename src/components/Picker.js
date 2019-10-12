import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
  container: {
      backgroundColor: 'white',
      margin: 10
  },
  select: {
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      backgroundColor: 'white'
    },
    margin: {
      margin: theme.spacing(1),
    },
  }
}));

const Picker = ({ value, onChange, options }) => {
  const classes = useStyles()

  return <span class={classes.container}>
    <Select classes={classes.select} onChange={e => onChange(e.target.value)} value={value}>
      {options.map(option =>
        <MenuItem value={option} key={option}>{option}</MenuItem>
      )}
    </Select>
  </span>
}

Picker.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

export default Picker
