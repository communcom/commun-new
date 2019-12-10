import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';

import FriendsWidget from './FriendsWidget';

export default connect((state, props) => {
  const community = entitySelector('communities', props.communityId)(state);

  if (community) {
    return {
      items: community.friends || [],
      friendsCount: community.friendsCount || 0,
    };
  }

  return {
    items: [],
    friendsCount: 0,
  };
})(FriendsWidget);
