import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import CreatableSelect from 'react-select/creatable'
import Option from './Option'
import { muiThemeToRSTheme } from '../helpers'

const useStyles = makeStyles(({ palette, spacing }) => ({
  container: {
    margin: spacing(2),
    marginLeft: 0,
    marginRight: spacing(1),
    display: 'block',
    backgroundColor: palette.background.default,
    maxHeight: 200,
    flex: 1,
  },
}))

const makeSelectStyles = ({ palette }) => ({
  container: styles => ({
    ...styles,
    backgroundColor: palette.background.default,
    color: palette.text.contrastText,
  }),
  menu: styles => ({
    ...styles,
    backgroundColor: palette.background.paper,
    border: `4px solid ${palette.background.paper}`,
  }),
})

const nameToOption = (name) => ({
  value: name.toLowerCase(), label: name,
})

const Picker = ({ value, options, onChange }) => {
  const classes = useStyles()
  const theme = useTheme()

  const mappedOptions = useMemo(() => (
    options.map(nameToOption)
  ), [options])

  const mappedValue = useMemo(() => (
    value ? nameToOption(value) : ''
  ), [value])

  const selectTheme = useMemo(() => (
    muiThemeToRSTheme(theme)
  ), [theme])

  const selectStyles = useMemo(() => (
    makeSelectStyles(theme)
  ), [theme])

  return (
    <div className={classes.container}>
      <CreatableSelect
        isClearable={false}
        menuPlacement="bottom"
        maxHeight={200}
        defaultValue={mappedValue}
        onChange={onChange}
        options={mappedOptions}
        theme={selectTheme}
        styles={selectStyles}
        components={{
          Option,
        }}
      />
    </div>
  )
}

Picker.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

export default Picker
