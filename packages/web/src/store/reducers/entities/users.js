import { path, map, isNil } from 'ramda';

import { UPDATE_PROFILE_DATA_SUCCESS, FETCH_LEADERS_SUCCESS } from 'store/constants';

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  let newState = state;
  const users = path(['entities', 'users'], payload);

  if (users) {
    newState = {
      ...newState,
      ...users,
    };
  }

  const profiles = path(['entities', 'profiles'], payload);

  if (profiles) {
    newState = {
      ...newState,
      ...map(
        profile => ({
          id: profile.userId,
          userId: profile.userId,
          username: profile.username ? profile.username.replace(/@golos$/, '') : profile.userId,
          avatarUrl: profile.personal?.avatarUrl,
        }),
        profiles
      ),
    };
  }

  switch (type) {
    case UPDATE_PROFILE_DATA_SUCCESS: {
      const { userId, updates } = meta;

      const user = newState[userId];

      if (!user) {
        return newState;
      }

      if (!isNil(updates.avatarUrl)) {
        return {
          ...newState,
          [userId]: {
            ...user,
            avatarUrl: updates.avatarUrl,
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
            userId: leader.userId,
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
