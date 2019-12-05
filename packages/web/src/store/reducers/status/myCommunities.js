/* eslint-disable prefer-destructuring */

import { uniq } from 'ramda';

import {
  FETCH_MY_COMMUNITIES,
  FETCH_MY_COMMUNITIES_SUCCESS,
  FETCH_MY_COMMUNITIES_ERROR,
  AUTH_LOGOUT_SUCCESS,
  JOIN_COMMUNITY,
  LEAVE_COMMUNITY,
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

    // optimistic
    case JOIN_COMMUNITY:
      return {
        ...state,
        order: uniq([meta.communityId].concat(state.order)),
      };

    // optimistic
    case LEAVE_COMMUNITY:
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
