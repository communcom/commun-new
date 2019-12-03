import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { ONBOARDING_REGISTRATION_WAIT_KEY } from 'shared/constants';

const OnboardingCheck = ({ isAuthorized, openOnboardingRegistration }) => {
  useEffect(() => {
    if (isAuthorized && localStorage[ONBOARDING_REGISTRATION_WAIT_KEY]) {
      // TODO: Temporary disable check
      // openOnboardingRegistration();
    }

    // TODO: Temporary for onbording of us
    if (isAuthorized && localStorage['onboarding.us']) {
      openOnboardingRegistration();
    }
  }, [isAuthorized, openOnboardingRegistration]);

  return null;
};

OnboardingCheck.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  openOnboardingRegistration: PropTypes.func.isRequired,
};

export default OnboardingCheck;
