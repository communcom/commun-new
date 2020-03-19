import { connect } from 'react-redux';

import { SHOW_MODAL_ONBOARDING_WELCOME } from 'store/constants';
import { dataSelector, modeSelector } from 'store/selectors/common';
import { isUnsafeAuthorizedSelector } from 'store/selectors/auth';
import { openModal } from 'store/actions/modals';

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
