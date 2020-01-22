import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';

import RewardsBadge from './RewardsBadge';

export default connect((state, props) => entitySelector('rewards', props.postId)(state) || {})(
  RewardsBadge
);
