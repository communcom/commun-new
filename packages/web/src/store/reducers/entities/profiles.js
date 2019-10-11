import { path, map } from 'ramda';
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
      const { account, meta: updatedMeta } = meta;

      const user = newState[account];

      if (!user) {
        return newState;
      }

      const updateFields = {};

      if (updatedMeta.profile_image) {
        updateFields.avatarUrl = updatedMeta.profile_image;
      }

      if (updatedMeta.cover_image) {
        updateFields.coverUrl = updatedMeta.cover_image;
      }

      newState = u.updateIn([account, 'personal'], updateFields, newState);

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
