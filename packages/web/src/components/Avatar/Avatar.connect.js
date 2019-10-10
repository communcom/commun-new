import { connect } from 'react-redux';
import { entitySelector } from 'store/selectors/common';

import Avatar from './Avatar';

export default connect((state, { userId, communityId }) => {
  if (userId) {
    const user = entitySelector('users', userId)(state);

    if (!user) {
      return {};
    }

    return {
      avatarUrl: user.avatarUrl,
      name: user.username,
      route: 'profile',
      routeParams: {
        username: user.username,
      },
    };
  }

  if (communityId) {
    const community = entitySelector('communities', communityId)(state);

    if (!community) {
      return {};
    }

    return {
      avatarUrl: community.avatarUrl,
      name: communityId,
      route: 'community',
      routeParams: {
        communityAlias: community.alias,
      },
    };
  }

  // eslint-disable-next-line no-console
  console.error('Invalid Avatar props');
  return {};
})(Avatar);
