import { connect } from 'react-redux';

import { amILeaderSelector } from 'store/selectors/auth';
import { screenTypeDown } from 'store/selectors/ui';
import { joinCommunity, leaveCommunity, setCommunityInfo } from 'store/actions/commun';

import CommunityHeader from './CommunityHeader';

export default connect(
  (state, props) => ({
    isLeader: amILeaderSelector(props.community.id)(state),
    isMobile: screenTypeDown.mobileLandscape(state),
  }),
  {
    joinCommunity,
    leaveCommunity,
    setCommunityInfo,
  }
)(CommunityHeader);
