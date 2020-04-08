import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { selectFeatureFlags } from '@flopflip/react-redux';

import { modeSelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';
import { isAuthorizedSelector } from 'store/selectors/auth';
import { openCreateCommunityConfirmationModal, openLoginModal } from 'store/actions/modals';
import Communities from './Communities';

export default connect(
  createSelector(
    [
      (state, props) => isOwnerSelector(props.userId)(state, props),
      selectFeatureFlags,
      modeSelector,
      isAuthorizedSelector,
    ],
    (isOwner, featureFlags, { screenType }, isAuthorized) => ({
      isOwner,
      featureFlags,
      isMobile: screenType === 'mobile',
      isAuthorized,
    })
  ),
  {
    openCreateCommunityConfirmationModal,
    openLoginModal,
  }
)(Communities);
