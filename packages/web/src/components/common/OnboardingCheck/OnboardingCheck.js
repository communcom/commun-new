import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { ONBOARDING_REGISTRATION_WAIT_KEY, WELCOME_STATE_KEY } from 'shared/constants';
import { getFieldValue } from 'utils/localStore';

const WELCOME_ONBOARDING_DELAY = 10000;
const WELCOME_REPEAT_DELAY = 60 * 1000;

export default function OnboardingCheck({
  isAuthorized,
  isAutoLogging,
  isMobile,
  openRegistrationOnboarding,
  openWelcomeOnboarding,
}) {
  const wasAuthorizedRef = useRef(isAuthorized);
  const welcomeShownRef = useRef(false);

  // If user was authorized at least once this flag will be true.
  // Uses for prohibit welcome screens in current session.
  if (!wasAuthorizedRef.current && isAuthorized) {
    wasAuthorizedRef.current = isAuthorized;
  }

  useEffect(() => {
    if (isAuthorized && localStorage[ONBOARDING_REGISTRATION_WAIT_KEY]) {
      // TODO: Temporary disable check
      // openRegistrationOnboarding();
    }

    // TODO: Temporary for onbording of us
    if (isAuthorized && localStorage['onboarding.us']) {
      openRegistrationOnboarding();
      return;
    }

    if (
      !isMobile &&
      !isAutoLogging &&
      !isAuthorized &&
      !wasAuthorizedRef.current &&
      !welcomeShownRef.current
    ) {
      const welcomeShownAt = getFieldValue(WELCOME_STATE_KEY, 'lastShownAt');
      let welcomeShownAtTs = null;

      if (welcomeShownAt) {
        welcomeShownAtTs = new Date(welcomeShownAt).getTime();
      }

      if (!welcomeShownAtTs || welcomeShownAtTs < Date.now() - WELCOME_REPEAT_DELAY) {
        welcomeShownRef.current = true;

        setTimeout(() => {
          const lastShownStep = getFieldValue(WELCOME_STATE_KEY, 'lastShownStep') || 0;
          openWelcomeOnboarding({ forceStep: lastShownStep });
        }, WELCOME_ONBOARDING_DELAY);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthorized, isAutoLogging, isMobile]);

  return null;
}

OnboardingCheck.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  openRegistrationOnboarding: PropTypes.func.isRequired,
  openWelcomeOnboarding: PropTypes.func.isRequired,
};
