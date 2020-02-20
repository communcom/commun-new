import { connect } from 'react-redux';

import { entityArraySelector, entitySelector, statusSelector } from 'store/selectors/common';
import { isUnsafeAuthorizedSelector } from 'store/selectors/auth';
import { fetchMyCommunities, getCommunities } from 'store/actions/gate';

import ChooseCommunity from './ChooseCommunity';

export default connect(
  (state, props) => {
    const isAuthorized = isUnsafeAuthorizedSelector(state);
    const community = entitySelector('communities', props.communityId)(state);
    const { order, isEnd, isLoading } = statusSelector(
      isAuthorized ? 'myCommunities' : 'communities'
    )(state);

    const communities = entityArraySelector('communities', order)(state);

    return {
      isAuthorized,
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
