import React, { useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Select from 'react-select'
import { connect } from 'react-redux'
import { StaticOption } from './Option'
import { muiThemeToRSTheme } from '../helpers'
import {
  enableKeyboardControls,
  disableKeyboardControls,
  selectSubredditScope,
} from '../actions'

import { makeSelectStyles } from './Picker'

const useStyles = makeStyles(({ palette, spacing }) => ({
  container: {
    minWidth: 150,
    display: 'block',
    backgroundColor: palette.background.default,
    margin: spacing(1),
    marginLeft: 0,
    marginRight: spacing(1),
    flex: 2,
  },
}))

const nameToOption = (name) => ({
  value: (name || '').toLowerCase(), label: name,
})

const SubredditScopePicker = ({
  value, options, selectedSubreddit, dispatch }) => {
  const classes = useStyles()
  const theme = useTheme()
  const ref = useRef()

  const changeSubredditScope = ({ value }) => {
    dispatch(selectSubredditScope(selectedSubreddit, value))
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
      <Select
        ref={ref}
        isClearable={false}
        menuPlacement="bottom"
        defaultValue={mappedValue}
        onChange={changeSubredditScope}
        options={mappedOptions}
        theme={selectTheme}
        maxMenuHeight={200}
        styles={selectStyles}
        onMenuOpen={onMenuOpen}
        onMenuClose={onMenuClose}
        components={{
          Option: StaticOption,
        }}
      />
    </div>
  )
}

SubredditScopePicker.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  value: PropTypes.string,
  dispatch: PropTypes.func,
  selectedSubreddit: PropTypes.string,
}

const mapStateToProps = ({ selectedSubreddit, postsBySubreddit }) => ({
  value: postsBySubreddit[selectedSubreddit]?.scope || 'hot',
  options: ['hot', 'new', 'controversial', 'top', 'rising'],
  selectedSubreddit,
})

export default SubredditScopePicker |> connect(mapStateToProps)

