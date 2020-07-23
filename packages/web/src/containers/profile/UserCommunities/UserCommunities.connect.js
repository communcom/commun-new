import { connect } from 'react-redux';

import { fetchUserCommunities } from 'store/actions/gate';
import { entityArraySelector, statusSelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';

import UserCommunities from './UserCommunities';

export default connect(
  (state, props) => {
    const isOwner = isOwnerSelector(props.userId)(state);
    const profileCommunities = statusSelector('profileCommunities')(state);

    return {
      items: entityArraySelector('communities', profileCommunities.order)(state),
      nextOffset: profileCommunities.nextOffset,
      isAllowLoadMore: !profileCommunities.isLoading && !profileCommunities.isEnd,
      isOwner,
    };
  },
  {
    fetchUserCommunities,
  }
)(UserCommunities);
