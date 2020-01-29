import { connect } from 'react-redux';
import { entitySelector } from 'store/selectors/common';

import { pin, unpin, joinCommunity, leaveCommunity } from 'store/actions/commun';
import { fetchProfile, fetchCommunity, waitForTransaction } from 'store/actions/gate';
import { isOwnerSelector } from 'store/selectors/user';

import EntityCard from './EntityCard';

export default connect(
  (state, { userId, communityId }) => {
    if (userId) {
      const user = entitySelector('profiles', userId)(state);

      if (!user) {
        return {};
      }

      return {
        coverUrl: user.coverUrl,
        name: user.username,
        followers: user.subscribersCount,
        isSubscribed: user.isSubscribed,
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
        name: communityId,
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
