/* eslint-disable import/prefer-default-export */

import { FETCH_PROFILE, FETCH_PROFILE_SUCCESS, FETCH_PROFILE_ERROR } from 'store/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { profileSchema } from 'store/schemas/gate';

export const fetchProfile = ({ userId, username }) => dispatch => {
  const params = {
    userId,
    username,
  };

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_PROFILE, FETCH_PROFILE_SUCCESS, FETCH_PROFILE_ERROR],
      method: 'content.getProfile',
      params,
      schema: profileSchema,
    },
    meta: params,
  });
};

export const suggestNames = text => ({
  [CALL_GATE]: {
    method: 'content.suggestNames',
    params: {
      text,
    },
  },
  meta: {
    text,
  },
});
