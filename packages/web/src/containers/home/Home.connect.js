import { connect } from 'react-redux';

import { modeSelector } from 'store/selectors/common';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';

import Home from './Home';

export default connect(state => {
  const { screenType } = modeSelector(state);
  const currentUserId = currentUnsafeUserIdSelector(state);
  return {
    currentUserId,
    isDesktop: screenType === 'desktop',
    isMobile: screenType === 'mobile' || screenType === 'mobileLandscape',
  };
})(Home);
