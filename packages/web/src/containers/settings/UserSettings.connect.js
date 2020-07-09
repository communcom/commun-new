import { connect } from 'react-redux';
import { selectFeatureFlags } from '@flopflip/react-redux';
import { createSelector } from 'reselect';

import { openModal } from 'store/actions/modals';
import { isAuthorizedSelector } from 'store/selectors/auth';
import { screenTypeDown, screenTypeUp } from 'store/selectors/ui';

import UserSettings from './UserSettings';

export default connect(
  createSelector(
    [
      isAuthorizedSelector,
      screenTypeDown.mobileLandscape,
      screenTypeUp.desktop,
      selectFeatureFlags,
    ],
    (isAuthorized, isMobile, isDesktop, featureFlags) => ({
      isAuthorized,
      isMobile,
      isDesktop,
      featureFlags, // just for rerender when featureFlags will restore on client
    })
  ),

  {
    openModal,
  }
)(UserSettings);
