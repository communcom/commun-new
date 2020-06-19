import { connect } from 'react-redux';
import { selectFeatureFlags } from '@flopflip/react-redux';

import { getUserSubscriptions } from 'store/actions/gate';
import { amILeaderSelector, currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { dataSelector, entitySelector, modeSelector } from 'store/selectors/common';

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
      isDesktop: screenType === 'desktop',
    };
  },
  {
    getUserSubscriptions,
  }
)(Community);
