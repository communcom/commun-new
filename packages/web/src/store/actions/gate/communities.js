/* eslint-disable import/prefer-default-export */

import { communitySchema } from 'store/schemas/gate';
import {
  FETCH_COMMUNITIES,
  FETCH_COMMUNITIES_SUCCESS,
  FETCH_COMMUNITIES_ERROR,
} from 'store/constants/actionTypes';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';

export const fetchCommunities = ({ type = 'all' } = {}) => async (dispatch, getState) => {
  const userId = currentUnsafeUserIdSelector(getState());

  const newParams = {
    type,
    userId,
  };

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_COMMUNITIES, FETCH_COMMUNITIES_SUCCESS, FETCH_COMMUNITIES_ERROR],
      method: 'content.getCommunities',
      params: newParams,
      schema: {
        items: [communitySchema],
      },
    },
    meta: newParams,
  });
};
