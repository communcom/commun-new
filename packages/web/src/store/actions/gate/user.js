import {
  FETCH_PROFILE,
  FETCH_PROFILE_ERROR,
  FETCH_PROFILE_SUCCESS,
  FETCH_USER_REFERRALS,
  FETCH_USER_REFERRALS_ERROR,
  FETCH_USER_REFERRALS_SUCCESS,
} from 'store/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { profileSchema, userSchema } from 'store/schemas/gate';

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

export const getUserReferrals = ({ offset = 0, limit = 20 } = {}) => {
  const params = {
    offset,
    limit,
  };

  return {
    [CALL_GATE]: {
      types: [FETCH_USER_REFERRALS, FETCH_USER_REFERRALS_SUCCESS, FETCH_USER_REFERRALS_ERROR],
      method: 'content.getReferralUsers',
      params,
      schema: {
        items: [userSchema],
      },
    },
    meta: {
      ...params,
      waitAutoLogin: true,
    },
  };
};
