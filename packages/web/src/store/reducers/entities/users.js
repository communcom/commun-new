/* eslint-disable no-param-reassign */

import { isNil } from 'ramda';

import { UPDATE_PROFILE_DATA_SUCCESS } from 'store/constants';
import { mergeEntities } from 'utils/store';

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  if (payload?.entities) {
    const { users, leaders, profiles } = payload?.entities;

    if (users) {
      state = mergeEntities(state, users, {
        merge: true,
      });
    }

    if (leaders) {
      state = mergeEntities(state, leaders, {
        transform: leader => ({
          id: leader.userId,
          userId: leader.userId,
          username: leader.username,
          avatarId: leader.avatarId,
          isSubscribed: leader.isSubscribed,
        }),
        merge: true,
      });
    }

    if (profiles) {
      state = mergeEntities(state, profiles, {
        transform: profile => ({
          id: profile.userId,
          userId: profile.userId,
          username: profile.username,
          avatarUrl: profile.personal?.avatarUrl,
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

    default:
      return state;
  }
}
