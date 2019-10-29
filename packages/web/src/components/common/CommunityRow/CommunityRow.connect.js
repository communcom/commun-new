import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';
import { joinCommunity, leaveCommunity } from 'store/actions/commun';
import { fetchCommunity, waitForTransaction } from 'store/actions/gate';

import CommunityRow from './CommunityRow';

export default connect(
  (state, props) => {
    const community = entitySelector('communities', props.communityId)(state);
    return {
      community,
    };
  },
  {
    joinCommunity,
    leaveCommunity,
    fetchCommunity,
    waitForTransaction,
  }
)(CommunityRow);
