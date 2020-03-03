import { connect } from 'react-redux';

import { isAuthorizedSelector } from 'store/selectors/auth';
import { entitySelector } from 'store/selectors/common';
import { joinCommunity, leaveCommunity, unblockCommunity } from 'store/actions/commun';
import { fetchCommunity, waitForTransaction } from 'store/actions/gate';
import { unauthAddCommunity, unauthRemoveCommunity } from 'store/actions/local';

import CommunityRow from './CommunityRow';

export default connect(
  (state, props) => ({
    isAuthorized: isAuthorizedSelector(state),
    community: entitySelector('communities', props.communityId)(state),
  }),
  {
    unauthAddCommunity,
    unauthRemoveCommunity,
    joinCommunity,
    leaveCommunity,
    unblockCommunity,
    fetchCommunity,
    waitForTransaction,
  }
)(CommunityRow);
