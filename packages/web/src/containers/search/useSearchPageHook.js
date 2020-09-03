/* eslint-disable no-shadow,react-hooks/exhaustive-deps */

import { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import uniq from 'ramda/src/uniq';

import { displayError } from 'utils/toastsMessages';
import { getCommunities } from 'store/actions/gate';
import { entitySearch } from 'store/actions/gate/search';

export const SEARCH_PAGE_SIZE = 20;

const initialState = {
  type: null,
  initialResults: null,
  isDiscovery: false,
  globalSearchId: 0,
};

function extractInitialState({ isDiscovery, type, initialResults }) {
  let paginationType;

  if (isDiscovery) {
    paginationType = 'communities';
  } else {
    paginationType = type || 'posts';
  }

  const paginationItems = initialResults[paginationType] || [];

  return {
    profiles: initialResults.profiles || [],
    communities: initialResults.communities || [],
    posts: initialResults.posts || [],
    nextOffset: paginationItems.length,
    isLoading: false,
    isEnd: paginationItems.length < SEARCH_PAGE_SIZE,
  };
}

export default function useSearchPageHook({ type, isDiscovery, searchText, initialResults }) {
  const [items, setItems] = useState(extractInitialState({ isDiscovery, type, initialResults }));

  const dispatch = useDispatch();

  const stateRef = useRef({
    ...initialState,
    type,
    isDiscovery,
    initialResults,
  });

  const state = stateRef.current;

  if (state.initialResults !== initialResults) {
    state.initialResults = initialResults;
    state.type = type;
    state.isDiscovery = isDiscovery;
    state.globalSearchId++;

    setItems(extractInitialState({ isDiscovery, type, initialResults }));
  }

  const onNeedLoadMore = useCallback(async () => {
    if (items.isLoading || items.isEnd) {
      return;
    }

    setItems({
      ...items,
      isLoading: true,
    });

    const currentGlobalSearchId = state.globalSearchId;
    let loadType;
    let newItems;

    try {
      if (state.isDiscovery) {
        loadType = 'communities';

        const results = await dispatch(
          getCommunities({
            limit: SEARCH_PAGE_SIZE,
            offset: items.nextOffset,
          })
        );

        newItems = results.items.map(({ communityId }) => communityId);
      } else {
        loadType = state.type || 'posts';

        const results = await dispatch(
          entitySearch({
            type: loadType,
            text: searchText,
            limit: SEARCH_PAGE_SIZE,
            offset: items.nextOffset,
          })
        );

        newItems = results.items;
      }
    } catch (err) {
      setItems({
        ...items,
        isLoading: false,
      });
      displayError(err);
      return;
    }

    // Если с момента начала запроса был выполнен глобальный поиск, то результаты пагинации уже устарели.
    if (currentGlobalSearchId !== state.globalSearchId) {
      return;
    }

    setItems({
      ...items,
      [loadType]: uniq(items[loadType].concat(newItems)),
      nextOffset: items.nextOffset + SEARCH_PAGE_SIZE,
      isLoading: false,
      isEnd: newItems.length < SEARCH_PAGE_SIZE,
    });
  }, [items]);

  return {
    ...items,
    onNeedLoadMore,
  };
}
