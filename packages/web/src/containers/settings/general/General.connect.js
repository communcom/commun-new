import { connect } from 'react-redux';
import { selectFeatureFlags } from '@flopflip/react-redux';
import { createSelector } from 'reselect';

import { fetchSettings, updateSettings } from 'store/actions/gate';
import {
  currentLocaleSelector,
  currentLocalesPostsSelector,
  isHideEmptyBalancesSelector,
  isShowCommentsInFeedSelector,
  nsfwTypeSelector,
  themeTypeSelector,
} from 'store/selectors/settings';

import General from './General';

export default connect(
  createSelector(
    [
      selectFeatureFlags,
      currentLocaleSelector,
      currentLocalesPostsSelector,
      nsfwTypeSelector,
      themeTypeSelector,
      isShowCommentsInFeedSelector,
      isHideEmptyBalancesSelector,
    ],
    (
      featureFlags,
      locale,
      localesPosts,
      nsfw,
      theme,
      isShowCommentsInFeed,
      isHideEmptyBalances
    ) => ({
      featureFlags,
      settings: {
        locale,
        localesPosts,
        nsfw,
        theme,
        isShowCommentsInFeed,
        isHideEmptyBalances,
      },
    })
  ),
  {
    fetchSettings,
    updateSettings,
  }
)(General);
