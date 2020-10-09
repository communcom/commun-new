import { connect } from 'react-redux';

import { fetchUsersCommunities, getCommunity } from 'store/actions/gate';
import { restoreData } from 'store/actions/local';
import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { entitySelector, isWebViewSelector, modeSelector } from 'store/selectors/common';

import CreateCommunityData from './CreateCommunityData';

export default connect(
  state => {
    const user = currentUnsafeUserSelector(state);
    const mode = modeSelector(state);
    const isWebView = isWebViewSelector(state);
    let profile;

    if (user) {
      const { userId: currentUserId } = user;
      profile = entitySelector('profiles', currentUserId)(state);
    }

    return {
      user,
      profile,
      isMobile: mode.screenType === 'mobile' || isWebView,
    };
  },
  {
    restoreData,
    fetchUsersCommunities,
    getCommunity,
  }
)(CreateCommunityData);
