import { connect } from 'react-redux';

import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { entitySelector, isWebViewSelector, modeSelector } from 'store/selectors/common';

import OnboardingRegistration from './OnboardingRegistration';

export default connect(state => {
  const user = currentUnsafeUserSelector(state);
  const mode = modeSelector(state);
  const isWebView = isWebViewSelector(state);
  let profile;

  if (user) {
    const { userId: currentUserId } = user;
    profile = entitySelector('profiles', currentUserId)(state);
  }

  return {
    user,
    profile,
    isMobile: mode.screenType === 'mobile' || isWebView,
  };
})(OnboardingRegistration);
