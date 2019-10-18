/* eslint-disable prefer-destructuring */

import { uniq } from 'ramda';

import {
  FETCH_MY_COMMUNITIES,
  FETCH_MY_COMMUNITIES_ERROR,
  FETCH_MY_COMMUNITIES_SUCCESS,
  AUTH_LOGOUT_SUCCESS,
  FOLLOW_COMMUNITY_SUCCESS,
} from 'store/constants/actionTypes';

const initialState = {
  order: [],
  isLoading: false,
  isEnd: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_MY_COMMUNITIES:
      if (meta.offset) {
        return {
          ...state,
          isLoading: true,
          isEnd: false,
        };
      }

      return {
        ...initialState,
        isLoading: true,
      };

    case FETCH_MY_COMMUNITIES_SUCCESS: {
      let order;

      if (meta.offset) {
        order = uniq(state.order.concat(payload.result.items));
      } else {
        order = payload.result.items;
      }

      return {
        ...state,
        order,
        isLoading: false,
        isEnd: payload.result.items < meta.limit,
      };
    }

    case FETCH_MY_COMMUNITIES_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    case FOLLOW_COMMUNITY_SUCCESS:
      return {
        ...state,
        order: uniq([meta.communityId].concat(state.order)),
      };

    case AUTH_LOGOUT_SUCCESS:
      return initialState;

    default:
  }

  return state;
}
