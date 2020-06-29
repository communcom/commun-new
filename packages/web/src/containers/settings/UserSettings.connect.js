import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { logout } from 'store/actions/gate';
import { openModal } from 'store/actions/modals';
import { isAuthorizedSelector } from 'store/selectors/auth';
import { screenTypeDown } from 'store/selectors/ui';

import UserSettings from './UserSettings';

export default connect(
  createSelector(
    [isAuthorizedSelector, screenTypeDown.mobileLandscape],
    (isAuthorized, isMobile) => ({
      isAuthorized,
      isMobile,
    })
  ),

  {
    logout,
    openModal,
  }
)(UserSettings);
