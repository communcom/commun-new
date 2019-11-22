import { useEffect } from 'react';
import PropTypes from 'prop-types';

const ONBOARDING_WELCOME_DONE = 'onboarding.welcome.done';

const OnboardingCheck = ({ openOnboarding }) => {
  useEffect(() => {
    if (!localStorage[ONBOARDING_WELCOME_DONE]) {
      openOnboarding();
      localStorage[ONBOARDING_WELCOME_DONE] = true;
    }
  }, [openOnboarding]);

  return null;
};

OnboardingCheck.propTypes = {
  openOnboarding: PropTypes.func.isRequired,
};

export default OnboardingCheck;
