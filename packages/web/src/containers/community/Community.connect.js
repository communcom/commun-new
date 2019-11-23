import { connect } from 'react-redux';
import { selectFeatureFlags } from '@flopflip/react-redux';

import { entitySelector, modeSelector, dataSelector } from 'store/selectors/common';
import { currentUnsafeUserIdSelector, amILeaderSelector } from 'store/selectors/auth';
import { getUserSubscriptions } from 'store/actions/gate';

import Community from './Community';

export default connect(
  (state, props) => {
    const { order } = dataSelector(['subscriptions'])(state);
    const currentUserId = currentUnsafeUserIdSelector(state);
    const { screenType } = modeSelector(state);

    return {
      currentUserId,
      isLeader: amILeaderSelector(props.communityId)(state),
      community: entitySelector('communities', props.communityId)(state),
      currentUserSubscriptions: order,
      featureFlags: selectFeatureFlags(state),
      isMobile: screenType === 'mobile',
      isDesktop: screenType === 'desktop',
    };
  },
  {
    getUserSubscriptions,
  }
)(Community);
