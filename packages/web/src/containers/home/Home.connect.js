import { connect } from 'react-redux';

import { modeSelector } from 'store/selectors/common';

import Home from './Home';

export default connect(state => {
  const { screenType } = modeSelector(state);
  return {
    isDesktop: screenType === 'desktop',
    isMobile: screenType === 'mobile' || screenType === 'mobileLandscape',
  };
})(Home);
