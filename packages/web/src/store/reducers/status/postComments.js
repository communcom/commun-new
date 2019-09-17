import { uniq } from 'ramda';

import {
  FETCH_POST_COMMENTS,
  FETCH_POST_COMMENTS_SUCCESS,
  FETCH_POST_COMMENTS_ERROR,
  DELETE_CONTENT_SUCCESS,
} from 'store/constants/actionTypes';
import { formatContentId } from 'store/schemas/gate';

const initialState = {
  order: [],
  sequenceKey: null,
  isLoading: false,
  isEnd: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_POST_COMMENTS:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_POST_COMMENTS_SUCCESS: {
      let order;

      // Если передан sequenceKey и он соответствует текущей ленте то просто добавляем новые посты
      if (meta.sequenceKey && meta.sequenceKey === state.sequenceKey) {
        order = uniq(state.order.concat(payload.result.items));
      } else {
        order = payload.result.items;
      }

      return {
        ...state,
        order,
        sequenceKey: payload.result.sequenceKey,
        isLoading: false,
        isEnd: payload.result.items.length < meta.limit,
      };
    }

    case FETCH_POST_COMMENTS_ERROR:
      return { ...state, isLoading: false };

    case DELETE_CONTENT_SUCCESS: {
      const id = formatContentId(meta.contentId);

      return {
        ...state,
        order: state.order.filter(currentId => currentId !== id),
      };
    }

    default:
      return state;
  }
}
