import { connect } from 'react-redux';

import { dataSelector, entitySelector } from 'store/selectors/common';
import { joinCommunity, leaveCommunity, unblockCommunity } from 'store/actions/commun';
import { fetchCommunity, waitForTransaction } from 'store/actions/gate';
import { unauthAddCommunity, unauthRemoveCommunity } from 'store/actions/local';

import CommunityRow from './CommunityRow';

export default connect(
  (state, props) => {
    let community = entitySelector('communities', props.communityId)(state);

    if (props.isSignUp) {
      const pendingCommunities = dataSelector(['unauth', 'communities'])(state);

      if (pendingCommunities.includes(props.communityId)) {
        community = {
          ...community,
          isSubscribed: true,
        };
      }
    }

    return {
      community,
    };
  },
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
