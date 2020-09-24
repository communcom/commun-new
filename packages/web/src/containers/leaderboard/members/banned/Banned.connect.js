import { connect } from 'react-redux';

import { fetchCommunityBlacklist } from 'store/actions/gate';
import { entityArraySelector, statusSelector } from 'store/selectors/common';

import Banned from './Banned';

export default connect(
  (state, props) => {
    const { communityId, isLoading, isEnd, order } = statusSelector('communityBlacklist')(state);

    if (communityId !== props.communityId) {
      return {
        items: [],
        isLoading: false,
        isEnd: false,
      };
    }

    return {
      items: entityArraySelector('users', order)(state),
      isLoading,
      isEnd,
    };
  },
  {
    fetchCommunityBlacklist,
  }
)(Banned);
