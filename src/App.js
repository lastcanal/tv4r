import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';

import Menu from './components/Menu'
import Post from './components/Post'

const styles = (theme) => ({
  root: {
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: theme.spacing(3),
    minHeight: '200vh'
  }
});

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

class App extends Component {
  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <Container fluid="true" classes={classes} maxWidth={false}>
          <Menu />
          <Post />
        </Container>
      </MuiThemeProvider>
    )
  }
}

export default withStyles(styles)(App)

