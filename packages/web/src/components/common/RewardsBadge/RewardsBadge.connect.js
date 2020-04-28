import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';
import { claimPost } from 'store/actions/commun';

import RewardsBadge from './RewardsBadge';

export default connect(
  (state, props) => ({
    reward: entitySelector('rewards', props.postId)(state) || {},
    isOwner: isOwnerSelector(props.contentId.userId)(state),
  }),
  {
    claimPost,
  }
)(RewardsBadge);
