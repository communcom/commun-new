import { connect } from 'react-redux';

import { amILeaderSelector } from 'store/selectors/auth';
import {
  joinCommunity,
  leaveCommunity,
  setCommunityInfo,
  blockCommunity,
  unblockCommunity,
} from 'store/actions/commun';
import { fetchCommunity, waitForTransaction } from 'store/actions/gate';
import { screenTypeDown, screenTypeUp } from 'store/selectors/ui';

import CommunityHeader from './CommunityHeader';

export default connect(
  (state, props) => ({
    isLeader: amILeaderSelector(props.community.id)(state),
    isMobile: screenTypeDown.mobileLandscape(state),
    isDesktop: screenTypeUp.desktop(state),
  }),
  {
    joinCommunity,
    leaveCommunity,
    blockCommunity,
    unblockCommunity,
    setCommunityInfo,
    fetchCommunity,
    waitForTransaction,
  }
)(CommunityHeader);
