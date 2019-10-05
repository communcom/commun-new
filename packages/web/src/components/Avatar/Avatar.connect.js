import { connect } from 'react-redux';
import { entitySelector } from 'store/selectors/common';

import Avatar from './Avatar';

export default connect((state, { userId, communityId }) => {
  if (userId) {
    const user = entitySelector('users', userId)(state);

    return {
      avatarUrl: user ? user.avatarUrl : null,
      name: userId,
      route: 'profile',
      routeParams: {
        userId,
      },
    };
  }

  if (communityId) {
    const community = entitySelector('communities', communityId)(state);

    return {
      avatarUrl: community ? community.avatarUrl : null,
      name: communityId,
      route: 'community',
      routeParams: {
        communityId,
      },
    };
  }

  // eslint-disable-next-line no-console
  console.error('Invalid Avatar props');
  return {};
})(Avatar);
