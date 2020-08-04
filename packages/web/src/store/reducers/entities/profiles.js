import isNil from 'ramda/src/isNil';
import map from 'ramda/src/map';
import omit from 'ramda/src/omit';
import path from 'ramda/src/path';
import u from 'updeep';

import { mergeEntities } from 'utils/store';
import {
  AUTH_LOGOUT,
  BLOCK_USER,
  DELETE_POST_SUCCESS,
  PIN,
  STOP_LEADER_SUCCESS,
  UNBLOCK_USER,
  UNPIN,
  UPDATE_PROFILE_DATA_SUCCESS,
} from 'store/constants';

const initialState = {};

export default function reducerEntitiesProfiles(state = initialState, { type, payload, meta }) {
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

    case DELETE_POST_SUCCESS:
      return u.updateIn(
        [meta.message_id.author, 'stats', 'postsCount'],
        postsCount => {
          if (postsCount > 0) {
            return postsCount - 1;
          }
          return postsCount;
        },
        state
      );

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
