import { connect } from 'react-redux';

import { fetchCommunityMembers } from 'store/actions/gate';
import { entityArraySelector, statusSelector } from 'store/selectors/common';

import Members from './Members';

export default connect(
  (state, props) => {
    const { communityId, isLoading, isEnd, order } = statusSelector('communityMembers')(state);

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
    fetchCommunityMembers,
  }
)(Members);
