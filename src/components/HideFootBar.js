import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Slide from '@material-ui/core/Slide';

const isBottom = () => (
  (window.innerHeight + window.scrollY) >= document.body.offsetHeight
)

const isTop = () => (
  window.scrollY === 0
)

const HideOnScroll = (props) => {
  const { children, threshold = 100 } = props;
  const scrollTrigger = useScrollTrigger({disableHysteresis: true, threshold: threshold });
  const trigger = isBottom()
    ? true
    : isTop()
      ? false
      : scrollTrigger

  return (
    <Slide appear={false} direction="up" in={trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  threshold: PropTypes.number,
};

const HideFootBar = (props) => {
  return (
    <HideOnScroll {...props}>
      <Paper {...props}>
        {props.children}
      </Paper>
    </HideOnScroll>
  );
}

export default HideFootBar

