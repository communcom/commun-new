import { connect } from 'react-redux';
import { selectFeatureFlags } from '@flopflip/react-redux';
import { createSelector } from 'reselect';

import { updateProfileMeta } from 'store/actions/commun';
import { fetchSettings, updateSettings } from 'store/actions/gate';
import { entitySelector } from 'store/selectors/common';
import {
  currentCurrencyPostsSelector,
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
      (state, props) => entitySelector('profiles', props.userId)(state),
      currentLocaleSelector,
      currentLocalesPostsSelector,
      currentCurrencyPostsSelector,
      nsfwTypeSelector,
      themeTypeSelector,
      isShowCommentsInFeedSelector,
      isHideEmptyBalancesSelector,
    ],
    (
      featureFlags,
      profile,
      locale,
      localesPosts,
      currencyPosts,
      nsfw,
      theme,
      isShowCommentsInFeed,
      isHideEmptyBalances
    ) => ({
      featureFlags,
      profile,
      settings: {
        locale,
        localesPosts,
        currencyPosts,
        nsfw,
        theme,
        isShowCommentsInFeed,
        isHideEmptyBalances,
      },
    })
  ),
  {
    updateProfileMeta,
    fetchSettings,
    updateSettings,
  }
)(General);
