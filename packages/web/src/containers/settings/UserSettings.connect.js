import { connect } from 'react-redux';
import { getAccountPermissions } from 'commun-client/lib/auth';
import { isEmpty } from 'ramda';
import { createSelector } from 'reselect';

import { fetchAccountPermissions } from 'store/actions/commun/permissions';
import { logout } from 'store/actions/gate';
import { fetchSettings, updateSettings } from 'store/actions/gate/settings';
import { isAuthorizedSelector } from 'store/selectors/auth';
import { dataSelector } from 'store/selectors/common';
import {
  currentLocaleSelector,
  isHideEmptyBalancesSelector,
  isShowCommentsInFeedSelector,
  nsfwTypeSelector,
  themeTypeSelector,
} from 'store/selectors/settings';
import { screenTypeDown } from 'store/selectors/ui';

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
