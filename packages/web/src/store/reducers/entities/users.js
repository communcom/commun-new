/* eslint-disable no-param-reassign */
import isNil from 'ramda/src/isNil';
import u from 'updeep';

import { mergeEntities } from 'utils/store';
import { PIN, UNPIN, UPDATE_PROFILE_DATA_SUCCESS } from 'store/constants';

const initialState = {};

export default function reducerEntitiesUsers(state = initialState, { type, payload, meta }) {
  if (payload?.entities) {
    const { users, leaders, profiles } = payload?.entities;

    if (users) {
      state = mergeEntities(state, users, {
        merge: true,
      });
    }

    if (leaders) {
      const fixedUsers = {};

      for (const leader of Object.values(leaders)) {
        fixedUsers[leader.userId] = {
          id: leader.userId,
          userId: leader.userId,
          username: leader.username,
          avatarUrl: leader.avatarUrl,
          isSubscribed: leader.isSubscribed,
        };
      }

      state = mergeEntities(state, fixedUsers, {
        merge: true,
      });
    }

    if (profiles) {
      state = mergeEntities(state, profiles, {
        transform: profile => ({
          id: profile.userId,
          userId: profile.userId,
          username: profile.username,
          avatarUrl: profile.avatarUrl,
          isSubscribed: profile.isSubscribed,
          subscribersCount: profile.subscribers.usersCount,
          postsCount: profile.stats.postsCount,
        }),
        merge: true,
      });
    }
  }

  switch (type) {
    case UPDATE_PROFILE_DATA_SUCCESS: {
      const { userId, updates } = meta;

      const user = state[userId];

      if (!user) {
        return state;
      }

      if (!isNil(updates.avatarUrl)) {
        return {
          ...state,
          [userId]: {
            ...user,
            avatarUrl: updates.avatarUrl,
          },
        };
      }

      return state;
    }

    case PIN:
      return u.updateIn([meta.pinning, 'isSubscribed'], true, state);

    case UNPIN:
      return u.updateIn([meta.pinning, 'isSubscribed'], false, state);

    default:
      return state;
  }
}
