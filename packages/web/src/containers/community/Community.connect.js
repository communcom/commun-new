import { connect } from 'react-redux';
import { selectFeatureFlags } from '@flopflip/react-redux';

import { entitySelector, modeSelector, dataSelector } from 'store/selectors/common';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { getUserSubscriptions } from 'store/actions/gate';

import Community from './Community';

export default connect(
  (state, props) => {
    const { order } = dataSelector(['subscriptions'])(state);
    const currentUserId = currentUnsafeUserIdSelector(state);
    const profile = currentUserId ? entitySelector('profiles', currentUserId)(state) : null;

    return {
      currentUserId,
      isLeader: profile ? profile.leaderIn.includes(props.communityId) : false,
      community: entitySelector('communities', props.communityId)(state),
      currentUserSubscriptions: order,
      featureFlags: selectFeatureFlags(state),
      isDesktop: modeSelector(state).screenType === 'desktop',
    };
  },
  {
    getUserSubscriptions,
  }
)(Community);
