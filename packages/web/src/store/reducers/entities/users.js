import { path, map } from 'ramda';

import { UPDATE_PROFILE_DATA_SUCCESS, FETCH_LEADERS_SUCCESS } from 'store/constants';

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  let newState = state;
  const users = path(['entities', 'users'], payload);

  if (users) {
    newState = {
      ...newState,
      ...map(
        user => ({
          ...user,
          username: user.username ? user.username.replace(/@golos$/, '') : user.userId,
        }),
        users
      ),
    };
  }

  const profiles = path(['entities', 'profiles'], payload);

  if (profiles) {
    newState = {
      ...newState,
      ...map(
        profile => ({
          id: profile.userId,
          username: profile.username ? profile.username.replace(/@golos$/, '') : profile.userId,
          avatarUrl: profile.personal?.avatarUrl,
        }),
        profiles
      ),
    };
  }

  switch (type) {
    case UPDATE_PROFILE_DATA_SUCCESS: {
      const { account, meta: updatedMeta } = meta;

      const user = newState[account];

      if (!user) {
        return newState;
      }

      if (updatedMeta.profile_image) {
        return {
          ...newState,
          [account]: {
            ...user,
            avatarUrl: updatedMeta.profile_image,
          },
        };
      }

      return newState;
    }

    case FETCH_LEADERS_SUCCESS:
      return {
        ...newState,
        ...map(
          leader => ({
            id: leader.userId,
            username: leader.username,
            avatarUrl: leader.avatarUrl,
          }),
          payload.items
        ),
      };

    default:
      return newState;
  }
}
