import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { isEmpty } from 'ramda';
import { getAccountPermissions } from 'cyber-client/lib/auth';

import {
  currentLocaleSelector,
  nsfwTypeSelector,
  notificationsSelector,
} from 'store/selectors/settings';
import { dataSelector } from 'store/selectors/common';
import { fetchSettings, saveSettings } from 'store/actions/gate/settings';
import { fetchAccountPermissions } from 'store/actions/commun/permissions';

import UserSettings from './UserSettings';

export default connect(
  createSelector(
    [
      currentLocaleSelector,
      nsfwTypeSelector,
      notificationsSelector,
      dataSelector(['chain', 'account']),
    ],
    (locale, nsfw, notifications, accountData) => {
      let publicKeys = {};

      if (!isEmpty(accountData)) {
        publicKeys = getAccountPermissions(accountData.permissions);
      }

      return {
        general: { locale, nsfw },
        notifications,
        publicKeys,
      };
    }
  ),
  { fetchSettings, saveSettings, fetchAccountPermissions }
)(UserSettings);
