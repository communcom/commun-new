import { connect } from 'react-redux';
import { selectFeatureFlags } from '@flopflip/react-redux';

import { entitySelector, modeSelector, dataSelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { getUserSubscriptions } from 'store/actions/gate';

import Community from './Community';

export default connect(
  (state, props) => {
    const { order } = dataSelector(['subscriptions'])(state);

    return {
      community: entitySelector('communities', props.communityId)(state),
      currentUserId: currentUserIdSelector(state),
      currentUserSubscriptions: order,
      featureFlags: selectFeatureFlags(state),
      isDesktop: modeSelector(state).screenType === 'desktop',
    };
  },
  {
    getUserSubscriptions,
  }
)(Community);
