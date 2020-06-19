import { connect } from 'react-redux';

import {
  blockCommunity,
  joinCommunity,
  leaveCommunity,
  setCommunityInfo,
  unblockCommunity,
} from 'store/actions/commun';
import { fetchCommunity, waitForTransaction } from 'store/actions/gate';
import { amILeaderSelector } from 'store/selectors/auth';
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
