import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { dataSelector } from 'store/selectors/common';
import { isUnsafeAuthorizedSelector } from 'store/selectors/auth';
import { SHOW_MODAL_ONBOARDING_WELCOME } from 'store/constants';

import InviteWidget from './InviteWidget';

export default connect(
  state => ({
    refId: dataSelector(['auth', 'refId'])(state),
    isAuthorized: isUnsafeAuthorizedSelector(state),
  }),
  {
    openOnboardingWelcome: () => openModal(SHOW_MODAL_ONBOARDING_WELCOME),
  }
)(InviteWidget);
