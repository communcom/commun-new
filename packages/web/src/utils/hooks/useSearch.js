import { useReducer, useRef, useState } from 'react';
import { uniq } from 'ramda';

import { useThrottledEffect } from 'utils/hooks/useThrottledEffect';
import { displayError } from 'utils/toastsMessages';

const FETCH = 'FETCH';
const FETCH_SUCCESS = 'FETCH_SUCCESS';
const FETCH_ERROR = 'FETCH_ERROR';

export const searchInitialState = {
  items: [],
  currentSearchText: '',
  isLoading: false,
  isError: false,
  isEnd: false,
};

function reducer(state, { type, payload, meta }) {
  const isPagination = meta.offset && state.currentSearchText === meta.search;

  switch (type) {
    case FETCH: {
      if (isPagination) {
        return {
          ...state,
          isLoading: true,
        };
      }

      return {
        ...searchInitialState,
        isLoading: true,
        isError: false,
      };
    }

    case FETCH_SUCCESS: {
      const items = isPagination ? uniq(state.items.concat(payload.items)) : payload.items;

      return {
        ...state,
        items,
        currentSearchText: meta.search,
        isEnd: payload.items.length < meta.limit,
        isLoading: false,
        isError: false,
      };
    }

    case FETCH_ERROR:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };

    default:
      throw new Error();
  }
}

// eslint-disable-next-line import/prefer-default-export
export function useSearch({ initialState, limit, loadData }) {
  const prevSearchTextRef = useRef();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchText, setSearchText] = useState('');

  const load = async isPaging => {
    const meta = {
      search: searchText,
      offset: isPaging ? state.items.length : 0,
      limit,
    };

    prevSearchTextRef.current = meta.search;

    dispatch({
      type: FETCH,
      meta,
    });

    try {
      const result = await loadData(meta);

      if (prevSearchTextRef.current === searchText) {
        dispatch({
          type: FETCH_SUCCESS,
          payload: result,
          meta,
        });
      }
    } catch (err) {
      displayError(err);

      dispatch({
        type: FETCH_ERROR,
        meta,
      });
    }
  };

  const onNeedLoad = isSearching => {
    const { isLoading, isEnd } = state;

    if (isSearching) {
      if (isLoading && prevSearchTextRef.current === searchText) {
        return;
      }

      load();
      return;
    }

    if (isLoading || isEnd) {
      return;
    }

    load(true);
  };

  useThrottledEffect(
    () => {
      onNeedLoad(true);
    },
    500,
    [searchText]
  );

  function onSearchTextChange(e) {
    setSearchText(e.target.value.trim());
  }

  return [state, searchText, onSearchTextChange, onNeedLoad];
}
