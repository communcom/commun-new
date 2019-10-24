import { path, map, isNil } from 'ramda';
import u from 'updeep';

import {
  UPDATE_PROFILE_DATA_SUCCESS,
  AUTH_LOGOUT,
  STOP_LEADER_SUCCESS,
  BECOME_LEADER_SUCCESS,
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
        personal: profile.personal || {},
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

      newState = u.updateIn([userId, 'personal'], updateFields, newState);

      return newState;
    }

    case BECOME_LEADER_SUCCESS:
      return u.updateIn(
        [meta.userId, 'leaderIn'],
        leaderIn => leaderIn.concat(meta.communityId),
        state
      );

    case STOP_LEADER_SUCCESS:
      return u.updateIn(
        [meta.userId, 'leaderIn'],
        leaderIn => leaderIn.filter(communityId => communityId !== meta.communityId),
        state
      );

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
