import { connect } from 'react-redux';

import { amILeaderSelector } from 'store/selectors/auth';
import { uiSelector } from 'store/selectors/common';
import { joinCommunity, leaveCommunity, setCommunityInfo } from 'store/actions/commun';

import CommunityHeader from './CommunityHeader';

export default connect(
  (state, props) => {
    const screenType = uiSelector(['mode', 'screenType'])(state);

    return {
      isLeader: amILeaderSelector(props.community.id)(state),
      isMobile: screenType === 'mobile' || screenType === 'mobileLandscape',
    };
  },
  {
    joinCommunity,
    leaveCommunity,
    setCommunityInfo,
  }
)(CommunityHeader);
