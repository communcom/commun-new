import { last, uniq } from 'ramda';

import {
  AUTH_LOGOUT,
  FETCH_NOTIFICATIONS,
  FETCH_NOTIFICATIONS_ERROR,
  FETCH_NOTIFICATIONS_SUCCESS,
} from 'store/constants/actionTypes';

const initialState = {
  order: [],
  isLoading: false,
  isEnd: false,
  lastTimestamp: null,
};

export const createNotificationsReducer = types => {
  const [fetch, fetchSuccess, fetchError] = types;

  return (state = initialState, { type, payload, meta }) => {
    switch (type) {
      case fetch:
        if (meta.beforeThan) {
          return {
            ...state,
            isLoading: true,
          };
        }

        return {
          ...initialState,
          isLoading: true,
        };

      case fetchSuccess: {
        if (!state.isLoading) {
          return state;
        }

        const { items } = payload.result;
        let order;

        if (meta.beforeThan) {
          order = uniq(state.order.concat(items));
        } else {
          order = items;
        }

        const newLast = last(payload.originalResult.items);
        const lastTimestamp = newLast ? newLast.timestamp : state.lastTimestamp;

        return {
          ...state,
          order,
          lastTimestamp,
          isLoading: false,
          isEnd: items.length < meta.limit,
        };
      }

      case fetchError:
        return {
          ...state,
          isLoading: false,
        };

      case AUTH_LOGOUT:
        return initialState;

      default:
        return state;
    }
  };
};

export default createNotificationsReducer([
  FETCH_NOTIFICATIONS,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_ERROR,
]);
