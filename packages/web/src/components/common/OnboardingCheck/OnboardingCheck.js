import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { ONBOARDING_REGISTRATION_WAIT_KEY, ONBOARDING_WELCOME_DONE_KEY } from 'shared/constants';

const OnboardingCheck = ({ isAuthorized, openOnboardingWelcome, openOnboardingRegistration }) => {
  useEffect(() => {
    if (!localStorage[ONBOARDING_WELCOME_DONE_KEY]) {
      openOnboardingWelcome();
      localStorage[ONBOARDING_WELCOME_DONE_KEY] = true;
    }

    if (isAuthorized && localStorage[ONBOARDING_REGISTRATION_WAIT_KEY]) {
      // TODO: Temporary disable check
      // openOnboardingRegistration();
    }
  }, [isAuthorized, openOnboardingWelcome, openOnboardingRegistration]);

  return null;
};

OnboardingCheck.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  openOnboardingWelcome: PropTypes.func.isRequired,
  openOnboardingRegistration: PropTypes.func.isRequired,
};

export default OnboardingCheck;
