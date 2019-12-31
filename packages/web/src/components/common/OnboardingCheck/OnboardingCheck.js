import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { ONBOARDING_REGISTRATION_WAIT_KEY } from 'shared/constants';
import cookie from 'cookie';

const OnboardingCheck = ({
  isAuthorized,
  isAutoLogging,
  openOnboardingRegistration,
  openSignUpModal,
}) => {
  useEffect(() => {
    const cookies = document.cookie ? cookie.parse(document.cookie) : {};

    if (isAuthorized && localStorage[ONBOARDING_REGISTRATION_WAIT_KEY]) {
      // TODO: Temporary disable check
      // openOnboardingRegistration();
    }

    // TODO: Temporary for onbording of us
    if (isAuthorized && localStorage['onboarding.us']) {
      openOnboardingRegistration();
    }

    // eslint-disable-next-line dot-notation
    if (!isAutoLogging && !isAuthorized && !cookies['commun_signup_proposed']) {
      openSignUpModal();

      // 6000000 === 10 minutes
      const expires = new Date(Date.now() + 6000000).toGMTString();
      document.cookie = `commun_signup_proposed=1; path=/; expires=${expires}`;
    }
  }, [isAuthorized, isAutoLogging, openOnboardingRegistration, openSignUpModal]);

  return null;
};

OnboardingCheck.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  isAutoLogging: PropTypes.bool.isRequired,
  openOnboardingRegistration: PropTypes.func.isRequired,
  openSignUpModal: PropTypes.func.isRequired,
};

export default OnboardingCheck;
