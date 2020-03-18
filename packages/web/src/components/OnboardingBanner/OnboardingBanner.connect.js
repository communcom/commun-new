import { connect } from 'react-redux';

import { screenTypeDown } from 'store/selectors/ui';
import { isWebViewSelector } from 'store/selectors/common';

import OnboardingBanner from './OnboardingBanner';

export default connect(state => ({
  isMobile: screenTypeDown.mobileLandscape(state),
  isWebView: isWebViewSelector(state),
}))(OnboardingBanner);
