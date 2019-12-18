import { connect } from 'react-redux';

import { amILeaderSelector } from 'store/selectors/auth';
import { statusSelector } from 'store/selectors/common';
import {
  joinCommunity,
  leaveCommunity,
  setCommunityInfo,
  blockCommunity,
  unblockCommunity,
} from 'store/actions/commun';
import { screenTypeDown } from 'store/selectors/ui';

import CommunityHeader from './CommunityHeader';

export default connect(
  (state, props) => {
    const communitiesBlacklist = statusSelector(['communitiesBlacklist', 'order'])(state);

    return {
      isLeader: amILeaderSelector(props.community.id)(state),
      isMobile: screenTypeDown.mobileLandscape(state),
      isInBlacklist: communitiesBlacklist.includes(props.community.id),
    };
  },
  {
    joinCommunity,
    leaveCommunity,
    blockCommunity,
    unblockCommunity,
    setCommunityInfo,
  }
)(CommunityHeader);
