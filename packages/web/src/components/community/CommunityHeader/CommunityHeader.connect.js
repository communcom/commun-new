import { connect } from 'react-redux';

import { joinCommunity, leaveCommunity } from 'store/actions/commun';

import CommunityHeader from './CommunityHeader';

export default connect(
  null,
  {
    joinCommunity,
    leaveCommunity,
  }
)(CommunityHeader);
