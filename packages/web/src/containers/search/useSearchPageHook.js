/* eslint-disable no-shadow,react-hooks/exhaustive-deps */

import { useState, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { uniq } from 'ramda';

import { entitySearch } from 'store/actions/gate/search';

export const SEARCH_PAGE_SIZE = 20;

const initialState = {
  type: null,
  initialResults: null,
  globalSearchId: 0,
};

function extractInitialState({ type, initialResults }) {
  const paginationType = type || 'posts';
  const paginationItems = initialResults[paginationType];

  return {
    profiles: initialResults.profiles || [],
    communities: initialResults.communities || [],
    posts: initialResults.posts || [],
    nextOffset: paginationItems.length,
    isLoading: false,
    isEnd: paginationItems.length < SEARCH_PAGE_SIZE,
  };
}

export default function({ type, searchText, initialResults }) {
  const [items, setItems] = useState(extractInitialState({ type, initialResults }));

  const dispatch = useDispatch();

  const { profiles, communities, posts } = items;

  const stateRef = useRef({
    ...initialState,
    type,
    items,
    initialResults,
  });

  const state = stateRef.current;
  state.items = items;

  if (state.initialResults !== initialResults) {
    state.initialResults = initialResults;
    state.type = type;
    state.globalSearchId++;

    const updatedItems = extractInitialState({ type, initialResults });
    state.items = updatedItems;
    setItems(updatedItems);
  }

  const onNeedLoadMore = useCallback(async () => {
    if (state.items.isLoading || state.items.isEnd) {
      return;
    }

    const currentGlobalSearchId = state.globalSearchId;
    const loadType = type || 'posts';

    const { items: newItems } = await dispatch(
      entitySearch({
        type: loadType,
        text: searchText,
        limit: SEARCH_PAGE_SIZE,
        offset: state.items.nextOffset,
      })
    );

    // Если с момента начала запроса был выполнен глобальный поиск, то результаты пагинации уже устарели.
    if (currentGlobalSearchId !== state.globalSearchId) {
      return;
    }

    const updatedItems = {
      ...state.items,
      [loadType]: uniq(state.items[loadType].concat(newItems)),
      nextOffset: state.items.nextOffset + SEARCH_PAGE_SIZE,
      isLoading: false,
      isEnd: newItems.length < SEARCH_PAGE_SIZE,
    };

    state.items = updatedItems;
    setItems(updatedItems);
  }, []);

  return {
    profiles,
    communities,
    posts,
    ...state,
    onNeedLoadMore,
  };
}
