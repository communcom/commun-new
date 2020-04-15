import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { isEmpty } from 'ramda';
import { getAccountPermissions } from 'commun-client/lib/auth';

import {
  currentLocaleSelector,
  nsfwTypeSelector,
  themeTypeSelector,
  isShowCommentsInFeedSelector,
  isHideEmptyBalancesSelector,
} from 'store/selectors/settings';
import { dataSelector } from 'store/selectors/common';
import { screenTypeDown } from 'store/selectors/ui';
import { isAuthorizedSelector } from 'store/selectors/auth';
import { logout } from 'store/actions/gate';
import { fetchSettings, updateSettings } from 'store/actions/gate/settings';
import { fetchAccountPermissions } from 'store/actions/commun/permissions';

import UserSettings from './UserSettings';

export default connect(
  createSelector(
    [
      isAuthorizedSelector,
      currentLocaleSelector,
      nsfwTypeSelector,
      themeTypeSelector,
      isShowCommentsInFeedSelector,
      isHideEmptyBalancesSelector,
      dataSelector(['chain', 'account']),
      screenTypeDown.mobileLandscape,
    ],
    (
      isAuthorized,
      locale,
      nsfw,
      theme,
      isShowCommentsInFeed,
      isHideEmptyBalances,
      accountData,
      isMobile
    ) => {
      let publicKeys = {};

      if (!isEmpty(accountData)) {
        publicKeys = getAccountPermissions(accountData.permissions);
      }

      return {
        isAuthorized,
        general: { locale, nsfw, theme, isShowCommentsInFeed, isHideEmptyBalances },
        publicKeys,
        isMobile,
      };
    }
  ),
  {
    logout,
    fetchSettings,
    updateSettings,
    fetchAccountPermissions,
  }
)(UserSettings);
