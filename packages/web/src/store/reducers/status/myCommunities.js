/* eslint-disable prefer-destructuring */

import { uniq } from 'ramda';

import {
  FETCH_MY_COMMUNITIES,
  FETCH_MY_COMMUNITIES_SUCCESS,
  FETCH_MY_COMMUNITIES_ERROR,
  AUTH_LOGOUT_SUCCESS,
  JOIN_COMMUNITY_SUCCESS,
  LEAVE_COMMUNITY_SUCCESS,
} from 'store/constants/actionTypes';

const initialState = {
  order: [],
  isLoading: false,
  isEnd: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_MY_COMMUNITIES:
      return {
        ...state,
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
        isEnd: payload.result.items.length < meta.limit,
      };
    }

    case FETCH_MY_COMMUNITIES_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    case JOIN_COMMUNITY_SUCCESS:
      return {
        ...state,
        order: uniq([meta.communityId].concat(state.order)),
      };

    case LEAVE_COMMUNITY_SUCCESS:
      return {
        ...state,
        order: state.order.filter(communityId => communityId !== meta.communityId),
      };

    case AUTH_LOGOUT_SUCCESS:
      return initialState;
    default:
  }

  return state;
}
