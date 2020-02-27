import React from 'react';
import PropTypes from 'prop-types';

import { useWidthWithoutScrollbar } from 'utils/hooks';

export default function ScrollFix({ withOnboardingBanner, ...props }) {
  const width = useWidthWithoutScrollbar();

  return <div style={width ? { width } : undefined} {...props} />;
}

ScrollFix.propTypes = {
  withOnboardingBanner: PropTypes.bool,
};

ScrollFix.defaultProps = {
  withOnboardingBanner: false,
};
