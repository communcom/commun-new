import { path, map, isNil, omit } from 'ramda';
import u from 'updeep';

import {
  UPDATE_PROFILE_DATA_SUCCESS,
  AUTH_LOGOUT,
  STOP_LEADER_SUCCESS,
  BLOCK_USER,
  UNBLOCK_USER,
  PIN,
  UNPIN,
} from 'store/constants';
import { mergeEntities } from 'utils/store';

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  let newState = state;
  const entities = path(['entities', 'profiles'], payload);

  if (entities) {
    newState = mergeEntities(newState, entities, {
      transform: profile => ({
        ...profile,
        personal: omit(['avatarUrl', 'coverUrl'], profile.personal),
      }),
      merge: true,
    });
  }

  switch (type) {
    case UPDATE_PROFILE_DATA_SUCCESS: {
      const { userId, updates } = meta;

      const user = newState[userId];

      if (!user) {
        return newState;
      }

      const updateFields = {};

      if (!isNil(updates.avatarUrl)) {
        updateFields.avatarUrl = updates.avatarUrl;
      }

      if (!isNil(updates.coverUrl)) {
        updateFields.coverUrl = updates.coverUrl;
      }

      return u.updateIn([userId], updateFields, newState);
    }

    case STOP_LEADER_SUCCESS:
      return u.updateIn(
        [meta.userId, 'leaderIn'],
        leaderIn => leaderIn.filter(communityId => communityId !== meta.communityId),
        state
      );

    case BLOCK_USER:
      return u.updateIn([meta.blocking, 'isInBlacklist'], true, state);

    case UNBLOCK_USER:
      return u.updateIn([meta.blocking, 'isInBlacklist'], false, state);

    case PIN:
      return u.updateIn([meta.pinning, 'isSubscribed'], true, state);

    case UNPIN:
      return u.updateIn([meta.pinning, 'isSubscribed'], false, state);

    case AUTH_LOGOUT:
      return map(
        profile => ({
          ...profile,
          isSubscribed: false,
        }),
        newState
      );

    default:
      return newState;
  }
}
