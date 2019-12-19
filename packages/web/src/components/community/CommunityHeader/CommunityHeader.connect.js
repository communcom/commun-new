import { connect } from 'react-redux';

import { amILeaderSelector } from 'store/selectors/auth';
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
  (state, props) => ({
    isLeader: amILeaderSelector(props.community.id)(state),
    isMobile: screenTypeDown.mobileLandscape(state),
  }),
  {
    joinCommunity,
    leaveCommunity,
    blockCommunity,
    unblockCommunity,
    setCommunityInfo,
  }
)(CommunityHeader);
