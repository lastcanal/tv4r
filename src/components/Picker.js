import React, { useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import CreatableSelect from 'react-select/creatable'
import { connect } from 'react-redux'
import Option from './Option'
import { muiThemeToRSTheme } from '../helpers'
import {
  enableKeyboardControls,
  disableKeyboardControls,
  loadSubreddit,
} from '../actions'

const useStyles = makeStyles(({ palette, spacing }) => ({
  container: {
    minWidth: 250,
    display: 'block',
    backgroundColor: palette.background.default,
    margin: spacing(1),
    marginLeft: 0,
    marginRight: spacing(1),
    flex: 3,
  },
}))

export const makeSelectStyles = ({ palette }) => ({
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
  value: (name || '').toLowerCase(), label: `r/${name}`,
})

const Picker = ({ value, options, dispatch }) => {
  const classes = useStyles()
  const theme = useTheme()
  const ref = useRef()

  const changeSubreddit = ({ value }) => {
    dispatch(loadSubreddit(value))
    void ref.current?.blur()
  }

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

  const onMenuOpen = () => {
    dispatch(disableKeyboardControls())
  }

  const onMenuClose = () => {
    dispatch(enableKeyboardControls())
  }

  return (
    <div className={classes.container}>
      <CreatableSelect
        ref={ref}
        isClearable={false}
        menuPlacement="bottom"
        value={mappedValue}
        onChange={changeSubreddit}
        options={mappedOptions}
        theme={selectTheme}
        maxMenuHeight={200}
        styles={selectStyles}
        onMenuOpen={onMenuOpen}
        onMenuClose={onMenuClose}
        components={{
          Option,
        }}
      />
    </div>
  )
}

Picker.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string,
  dispatch: PropTypes.func,
}

const mapStateToProps = ({ selectedSubreddit, subreddits }) => ({
  value: selectedSubreddit,
  options: subreddits,
})

export default Picker |> connect(mapStateToProps)
