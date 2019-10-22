import { connect } from 'react-redux';

import { statusSelector, entityArraySelector } from 'store/selectors/common';
import { fetchCommunityMembers } from 'store/actions/gate';

import Members from './Members';

export default connect(
  (state, props) => {
    const { communityId, isLoading, isEnd, order } = statusSelector('communityMembers')(state);

    if (communityId !== props.communityId) {
      return {
        members: [],
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
