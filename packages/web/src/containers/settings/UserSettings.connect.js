import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { fetchAccountPermissions } from 'store/actions/commun/permissions';
import { logout } from 'store/actions/gate';
import { fetchSettings, updateSettings } from 'store/actions/gate/settings';
import { openModal } from 'store/actions/modals';
import { isAuthorizedSelector } from 'store/selectors/auth';
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
      screenTypeDown.mobileLandscape,
    ],
    (isAuthorized, locale, nsfw, theme, isShowCommentsInFeed, isHideEmptyBalances, isMobile) => ({
      isAuthorized,
      general: { locale, nsfw, theme, isShowCommentsInFeed, isHideEmptyBalances },
      isMobile,
    })
  ),

  {
    logout,
    fetchSettings,
    updateSettings,
    fetchAccountPermissions,
    openModal,
  }
)(UserSettings);
