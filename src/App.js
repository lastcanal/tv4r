import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import Menu from './components/Menu'
import Post from './components/Post'

const styles = (theme) => ({
  root: {
    backgroundColor: '#000',
    color: '#eee',
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: 20,
    minHeight: window.screen.availHeight * 1.2
  }
});

class App extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Container fluid="true" classes={classes} maxWidth={false}>
        <Post />
        <Menu />
      </Container>
    )
  }
}

export default withStyles(styles)(App)

