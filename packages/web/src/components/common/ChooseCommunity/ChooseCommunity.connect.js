import { connect } from 'react-redux';

import { entityArraySelector, entitySelector, statusSelector } from 'store/selectors/common';
import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { fetchMyCommunities, getCommunities } from 'store/actions/gate';

import ChooseCommunity from './ChooseCommunity';

export default connect(
  (state, props) => {
    const user = currentUnsafeUserSelector(state);
    const isAuthorized = Boolean(user);
    const { order, isEnd, isLoading } = statusSelector(
      isAuthorized ? 'myCommunities' : 'communities'
    )(state);

    const communities = entityArraySelector('communities', order)(state);

    let community = null;

    if (props.communityId) {
      if (props.communityId === 'FEED') {
        community = {
          id: 'FEED',
          communityId: 'FEED',
          name: 'Feed',
        };
      } else {
        community = entitySelector('communities', props.communityId)(state);
      }
    }

    return {
      isAuthorized,
      authUserId: user ? user.userId : null,
      community,
      communities,
      isEnd,
      isLoading,
    };
  },
  {
    fetchMyCommunities,
    getCommunities,
  }
)(ChooseCommunity);
