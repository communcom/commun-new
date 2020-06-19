import { connect } from 'react-redux';

import { joinCommunity, leaveCommunity, pin, unpin } from 'store/actions/commun';
import { fetchCommunity, fetchProfile, waitForTransaction } from 'store/actions/gate';
import { entitySelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';

import EntityCard from './EntityCard';

export default connect(
  (state, { userId, communityId }) => {
    if (userId) {
      const profile = entitySelector('profiles', userId)(state);

      if (!profile) {
        return {};
      }

      return {
        coverUrl: profile.coverUrl,
        name: profile.username,
        followers: profile.subscribers.usersCount,
        isSubscribed: profile.isSubscribed,
        isOwnerUser: isOwnerSelector(userId)(state),
      };
    }

    if (communityId) {
      const community = entitySelector('communities', communityId)(state);

      if (!community) {
        return {};
      }

      return {
        coverUrl: community.coverUrl,
        name: community.name,
        alias: community.alias,
        followers: community.subscribersCount,
        isSubscribed: community.isSubscribed,
      };
    }

    // eslint-disable-next-line no-console
    console.error('Invalid EntityCard props');
    return {};
  },
  {
    pin,
    unpin,
    joinCommunity,
    leaveCommunity,
    fetchProfile,
    fetchCommunity,
    waitForTransaction,
  }
)(EntityCard);
