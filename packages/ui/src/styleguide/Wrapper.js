import React, { Fragment } from 'react';
import { ThemeProvider } from 'styled-components';

import { Sprite } from '@commun/icons';

import theme from '../themes';
import { GlobalStyles } from '../styles';

const Wrapper = ({ children }) => (
  <Fragment>
    <GlobalStyles />
    <Sprite />
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </Fragment>
);

export default Wrapper;
