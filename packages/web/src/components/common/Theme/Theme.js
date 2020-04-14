import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';

import { themes } from '@commun/ui';

export default function Theme({ isDark, children }) {
  const [isMounted, setIsMounted] = useState(false);
  const theme = isDark ? themes.dark : themes.main;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (process.browser && !isMounted) {
    return <div />;
  }

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

Theme.propTypes = {
  isDark: PropTypes.bool.isRequired,
};
