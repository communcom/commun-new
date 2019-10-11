import { path, map, isNil } from 'ramda';
import u from 'updeep';

import { UPDATE_PROFILE_DATA_SUCCESS, AUTH_LOGOUT } from 'store/constants';
import { mergeEntities } from 'utils/store';

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  let newState = state;
  const entities = path(['entities', 'profiles'], payload);

  if (entities) {
    newState = mergeEntities(newState, entities, {
      transform: profile => {
        const updatedProfile = { ...profile };

        updatedProfile.username = profile.username
          ? profile.username.replace(/@golos$/, '')
          : profile.userId;

        if (!updatedProfile.created) {
          updatedProfile.created = '2019-05-10T10:00:00.000Z';
        }

        if (!updatedProfile.personal) {
          updatedProfile.personal = {};
        }

        return updatedProfile;
      },
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
