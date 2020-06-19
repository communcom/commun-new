import { connect } from 'react-redux';

import { joinCommunity, leaveCommunity } from 'store/actions/commun';
import { entityArraySelector, statusWidgetSelector } from 'store/selectors/common';

import LeaderInWidget from './LeaderInWidget';

export default connect(
  (state, { userId }) => {
    const order = statusWidgetSelector(['userLeaderCommunities', userId])(state);

    if (!order || !order.length) {
      return {
        items: [],
      };
    }

    return {
      items: entityArraySelector('communities', order)(state),
    };
  },
  {
    joinCommunity,
    leaveCommunity,
  }
)(LeaderInWidget);
