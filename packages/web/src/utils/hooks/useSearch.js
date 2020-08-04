import { useReducer, useRef, useState } from 'react';
import uniq from 'ramda/src/uniq';

import { useThrottledEffect } from 'utils/hooks/useThrottledEffect';
import { displayError } from 'utils/toastsMessages';

const FETCH = 'FETCH';
const FETCH_SUCCESS = 'FETCH_SUCCESS';
const FETCH_ERROR = 'FETCH_ERROR';
const CLEAR = 'CLEAR';

export const searchInitialState = {
  items: [],
  currentSearchText: '',
  isLoading: false,
  isError: false,
  isEnd: false,
};

function reducer(state, { type, payload, meta }) {
  const isPagination = meta.offset && state.currentSearchText === meta.searchText;

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
        items: state.items,
        isLoading: true,
      };
    }

    case FETCH_SUCCESS: {
      const items = isPagination ? uniq(state.items.concat(payload.items)) : payload.items;

      return {
        ...state,
        items,
        currentSearchText: meta.searchText,
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

    case CLEAR:
      return searchInitialState;

    default:
      throw new Error();
  }
}

export default function useSearch(
  { initialState = searchInitialState, limit, loadData, clearWhenEmpty = false },
  deps = []
) {
  const prevSearchTextRef = useRef();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchText, setSearchText] = useState('');

  const load = async isPaging => {
    const searchTextTrim = searchText.trim();

    if (clearWhenEmpty && searchTextTrim.length === 0) {
      dispatch({
        type: CLEAR,
        meta: {},
      });
      return;
    }

    const meta = {
      searchText: searchTextTrim,
      offset: isPaging ? state.items.length : 0,
      limit,
    };

    prevSearchTextRef.current = meta.searchText;

    dispatch({
      type: FETCH,
      meta,
    });

    try {
      const result = await loadData(meta);

      if (prevSearchTextRef.current === meta.searchText) {
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

  const firstRef = useRef(true);

  useThrottledEffect(
    () => {
      if (firstRef.current) {
        firstRef.current = false;
      } else {
        onNeedLoad(true);
      }
    },
    500,
    [searchText, ...deps]
  );

  function onSearchInputChange(e) {
    setSearchText(e.target.value);
  }

  return {
    searchState: state,
    searchText,
    setSearchText,
    onSearchInputChange,
    onNeedLoad,
  };
}
