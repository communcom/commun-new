import { connect } from 'react-redux';

import { screenTypeDown } from 'store/selectors/ui';

import OnboardingBanner from './OnboardingBanner';

export default connect(state => ({
  isMobile: screenTypeDown.mobileLandscape(state),
}))(OnboardingBanner);
