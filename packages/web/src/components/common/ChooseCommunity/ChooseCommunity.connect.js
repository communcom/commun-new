import { connect } from 'react-redux';

import { entityArraySelector, entitySelector, statusSelector } from 'store/selectors/common';
import { fetchMyCommunities } from 'store/actions/gate';

import ChooseCommunity from './ChooseCommunity';

export default connect(
  (state, props) => {
    const community = entitySelector('communities', props.communityId)(state);
    const { order, isEnd, isLoading } = statusSelector('myCommunities')(state);
    const communities = entityArraySelector('communities', order)(state);

    return {
      community,
      communities,
      isEnd,
      isLoading,
    };
  },
  {
    fetchMyCommunities,
  }
)(ChooseCommunity);
