import { connect } from 'react-redux';

import { fetchUsersCommunities, getCommunity } from 'store/actions/gate';
import { restoreData } from 'store/actions/local';
import { dataSelector, isWebViewSelector, modeSelector } from 'store/selectors/common';

import CreateCommunityData from './CreateCommunityData';

export default connect(
  state => {
    const communityCreationState = dataSelector('createCommunity')(state);
    const mode = modeSelector(state);
    const isWebView = isWebViewSelector(state);

    return {
      name: communityCreationState.name,
      isMobile: mode.screenType === 'mobile' || isWebView,
    };
  },
  {
    restoreData,
    fetchUsersCommunities,
    getCommunity,
  }
)(CreateCommunityData);
