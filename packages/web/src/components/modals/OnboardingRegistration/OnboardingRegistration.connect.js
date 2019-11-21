import { connect } from 'react-redux';

import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { entitySelector } from 'store/selectors/common';

import OnboardingRegistration from './OnboardingRegistration';

export default connect(state => {
  const user = currentUnsafeUserSelector(state);
  let profile;

  if (user) {
    const { userId: currentUserId } = user;
    profile = entitySelector('profiles', currentUserId)(state);
  }

  return {
    user,
    profile,
  };
})(OnboardingRegistration);
