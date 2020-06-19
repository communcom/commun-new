import { connect } from 'react-redux';

import { openModal } from 'store/actions/modals';
import { SHOW_MODAL_ONBOARDING_WELCOME } from 'store/constants';
import { isUnsafeAuthorizedSelector } from 'store/selectors/auth';
import { dataSelector, modeSelector } from 'store/selectors/common';

import InviteWidget from './InviteWidget';

export default connect(
  state => ({
    isDesktop: modeSelector(state).screenType === 'desktop',
    refId: dataSelector(['auth', 'refId'])(state),
    isAuthorized: isUnsafeAuthorizedSelector(state),
  }),
  {
    openOnboardingWelcome: () => openModal(SHOW_MODAL_ONBOARDING_WELCOME),
  }
)(InviteWidget);
