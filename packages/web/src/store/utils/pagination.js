/* eslint-disable no-param-reassign */

import uniq from 'ramda/src/uniq';

export const initialPaginationState = {
  order: [],
  nextOffset: 0,
  isLoading: false,
  isEnd: false,
  error: null,
};

export default ([INIT, SUCCESS, ERROR]) => {
  let wrapperReducer = null;

  const paginationReducer = (state, action) => {
    if (state === undefined) {
      state = initialPaginationState;

      if (wrapperReducer) {
        state = {
          ...state,
          ...wrapperReducer(undefined, { type: '@@PAGINATION.INITIAL', payload: {} }),
        };
      }
    }

    const { type, payload, error, meta } = action;

    switch (type) {
      case INIT:
        state = {
          ...state,
          isLoading: true,
        };
        break;

      case SUCCESS: {
        let order;
        const { items } = payload.result;

        if (meta.offset) {
          order = uniq(state.order.concat(items));
        } else {
          order = items;
        }

        state = {
          ...state,
          order,
          nextOffset: (meta.offset || 0) + (meta.limit || items.length),
          isLoading: false,
          isEnd: items.length < meta.limit,
          error: null,
        };
        break;
      }

      case ERROR:
        state = {
          ...state,
          isLoading: false,
          error,
        };
        break;

      default:
    }

    if (wrapperReducer) {
      return wrapperReducer(state, action);
    }

    return state;
  };

  return (arg1, arg2) => {
    if (arg1 instanceof Function) {
      wrapperReducer = arg1;
      return paginationReducer;
    }

    return paginationReducer(arg1, arg2);
  };
};
