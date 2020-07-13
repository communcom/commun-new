import { connect } from 'react-redux';
import { selectFeatureFlags } from '@flopflip/react-redux';
import { createSelector } from 'reselect';

import { openCreateCommunityConfirmationModal, openLoginModal } from 'store/actions/modals';
import { isAuthorizedSelector } from 'store/selectors/auth';
import { dataSelector, modeSelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';

import Communities from './Communities';

export default connect(
  createSelector(
    [
      (state, props) => isOwnerSelector(props.userId)(state, props),
      selectFeatureFlags,
      modeSelector,
      isAuthorizedSelector,
      dataSelector(['auth', 'isAutoLogging']),
      dataSelector('config'),
    ],
    (isOwner, featureFlags, { screenType }, isAuthorized, isAutoLogging, { isMaintenance }) => ({
      isOwner,
      featureFlags,
      isMobile: screenType === 'mobile',
      isAuthorized,
      isAutoLogging,
      isMaintenance,
    })
  ),
  {
    openCreateCommunityConfirmationModal,
    openLoginModal,
  }
)(Communities);
