import { connect } from 'react-redux';
import { selectFeatureFlags } from '@flopflip/react-redux';

import { amILeaderSelector, currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { entitySelector, modeSelector } from 'store/selectors/common';

import Community from './Community';

export default connect((state, props) => {
  const currentUserId = currentUnsafeUserIdSelector(state);
  const { screenType } = modeSelector(state);

  return {
    currentUserId,
    isLeader: amILeaderSelector(props.communityId)(state),
    community: entitySelector('communities', props.communityId)(state),
    featureFlags: selectFeatureFlags(state),
    isDesktop: screenType === 'desktop',
  };
})(Community);
