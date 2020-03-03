import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_ONBOARDING_APP_BANNER } from 'store/constants';
import { dataSelector } from 'store/selectors/common';
import { screenTypeDown } from 'store/selectors/ui';
import { currentUserIdSelector } from 'store/selectors/auth';

import Layout from './Layout';

export default connect(
  state => ({
    isMobile: screenTypeDown.mobileLandscape(state),
    loggedUserId: currentUserIdSelector(state),
    isAutoLogging: dataSelector(['auth', 'isAutoLogging'])(state),
  }),
  {
    openAppBannerModal: () => openModal(SHOW_MODAL_ONBOARDING_APP_BANNER),
  }
)(Layout);
