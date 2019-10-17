/* eslint-disable prefer-destructuring */

import { uniq } from 'ramda';

import {
  FETCH_MY_COMMUNITIES,
  FETCH_MY_COMMUNITIES_ERROR,
  FETCH_MY_COMMUNITIES_SUCCESS,
  AUTH_LOGOUT_SUCCESS,
} from 'store/constants/actionTypes';

const initialState = {
  items: null,
  isLoading: false,
  isError: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_MY_COMMUNITIES:
      if (meta.offset) {
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      }

      return {
        ...initialState,
        isLoading: true,
        isError: false,
      };

    case FETCH_MY_COMMUNITIES_SUCCESS: {
      let items;

      if (meta.offset) {
        items = uniq(state.items.concat(payload.result.items));
      } else {
        items = payload.result.items;
      }

      return {
        ...state,
        items,
        isLoading: false,
        isError: false,
      };
    }

    case FETCH_MY_COMMUNITIES_ERROR:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };

    case AUTH_LOGOUT_SUCCESS:
      return initialState;

    default:
  }

  return state;
}
