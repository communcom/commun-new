import { connect } from 'react-redux';

import { entityArraySelector } from 'store/selectors/common';
import { joinCommunity, leaveCommunity } from 'store/actions/commun';

import LeaderInWidget from './LeaderInWidget';

export default connect(
  (state, props) => {
    let items = [];

    if (props?.profile?.leaderIn?.length) {
      items = entityArraySelector('communities', props.profile.leaderIn)(state);
    }

    return {
      items,
    };
  },
  {
    joinCommunity,
    leaveCommunity,
  }
)(LeaderInWidget);
