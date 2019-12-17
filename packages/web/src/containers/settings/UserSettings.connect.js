import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { isEmpty } from 'ramda';
import { getAccountPermissions } from 'commun-client/lib/auth';

import {
  currentLocaleSelector,
  nsfwTypeSelector,
  notificationsSelector,
} from 'store/selectors/settings';
import { dataSelector, uiSelector } from 'store/selectors/common';
import { isAuthorizedSelector } from 'store/selectors/auth';
import { logout } from 'store/actions/gate';
import { fetchSettings, saveSettings } from 'store/actions/gate/settings';
import { fetchAccountPermissions } from 'store/actions/commun/permissions';

import UserSettings from './UserSettings';

export default connect(
  createSelector(
    [
      isAuthorizedSelector,
      currentLocaleSelector,
      nsfwTypeSelector,
      notificationsSelector,
      dataSelector(['chain', 'account']),
      uiSelector(['mode', 'screenType']),
    ],
    (isAuthorized, locale, nsfw, notifications, accountData, screenType) => {
      let publicKeys = {};

      if (!isEmpty(accountData)) {
        publicKeys = getAccountPermissions(accountData.permissions);
      }

      return {
        isAuthorized,
        general: { locale, nsfw },
        notifications,
        publicKeys,
        isMobile: screenType === 'mobile' || screenType === 'mobileLandscape',
      };
    }
  ),
  { logout, fetchSettings, saveSettings, fetchAccountPermissions }
)(UserSettings);
