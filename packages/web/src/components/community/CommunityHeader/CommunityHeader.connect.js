import { connect } from 'react-redux';

import { amILeaderSelector } from 'store/selectors/auth';
import { joinCommunity, leaveCommunity, setCommunityInfo } from 'store/actions/commun';

import CommunityHeader from './CommunityHeader';

export default connect(
  (state, props) => ({
    isLeader: amILeaderSelector(props.community.id)(state),
  }),
  {
    joinCommunity,
    leaveCommunity,
    setCommunityInfo,
  }
)(CommunityHeader);
