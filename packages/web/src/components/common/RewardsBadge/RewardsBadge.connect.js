import { connect } from 'react-redux';
import { selectFeatureFlags } from '@flopflip/react-redux';

import { claimPost } from 'store/actions/commun';
import { entitySelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';

import RewardsBadge from './RewardsBadge';

export default connect(
  (state, props) => ({
    reward: entitySelector('rewards', props.postId)(state) || {},
    isOwner: isOwnerSelector(props.contentId.userId)(state),
    featureFlags: selectFeatureFlags(state),
  }),
  {
    claimPost,
  }
)(RewardsBadge);
