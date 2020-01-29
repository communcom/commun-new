import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { KEY_CODES, Search, up } from '@commun/ui';
import { Router } from 'shared/routes';
import { useSearch } from 'utils/hooks';

import AutocompleteResults from './AutocompleteResults';

const MAX_AUTOCOMPLETE_RESULTS = 5;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-grow: 1;

  ${up.desktop} {
    width: 400px;
    flex-grow: 0;
  }
`;

const CustomSearch = styled(Search)`
  width: 100%;

  ${up.desktop} {
    width: 400px;
    height: 34px;
  }

  input {
    caret-color: ${({ theme }) => theme.colors.blue};

    &::placeholder {
      font-size: 14px;
      line-height: 20px;
    }
  }
`;

export default function SearchPanel({ quickSearch }) {
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const resultsRef = useRef(null);

  const loadData = useCallback(
    ({ searchText, limit }) => quickSearch({ type: 'matchPrefix', text: searchText, limit }),
    [quickSearch]
  );

  const { searchState, searchText, setSearchText } = useSearch({
    limit: MAX_AUTOCOMPLETE_RESULTS,
    loadData,
    clearWhenEmpty: true,
  });

  function goTo({ route, params }) {
    resultsRef.current.close();
    setSearchText('');
    inputRef.current.blur();
    Router.pushRoute(route, params);
  }

  function onKeyDown(e) {
    switch (e.which) {
      case KEY_CODES.ENTER: {
        e.preventDefault();

        const text = searchText.trim();

        if (!text) {
          break;
        }

        if (resultsRef.current) {
          const route = resultsRef.current.getCursorRoute();

          if (route) {
            goTo(route);
            return;
          }
        }

        goTo({
          route: 'search',
          params: { q: text },
        });
        break;
      }
      case KEY_CODES.UP:
        e.preventDefault();
        if (resultsRef.current) {
          resultsRef.current.moveCursorUp();
        }
        break;
      case KEY_CODES.DOWN:
        e.preventDefault();
        if (resultsRef.current) {
          resultsRef.current.moveCursorDown();
        }
        break;
      default:
    }
  }

  function onFocus() {
    if (resultsRef.current && searchText.trim()) {
      resultsRef.current.open();
    }
  }

  return (
    <Wrapper ref={panelRef}>
      <CustomSearch
        ref={inputRef}
        label="Search"
        type="search"
        placeholder="Search..."
        name="header__search-input"
        value={searchText}
        noBorder
        inverted
        isLoading={searchState.isLoading}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onChange={setSearchText}
      />
      {searchText.trim() ? (
        <AutocompleteResults ref={resultsRef} panelRef={panelRef} searchState={searchState} />
      ) : null}
    </Wrapper>
  );
}

SearchPanel.propTypes = {
  quickSearch: PropTypes.func.isRequired,
};
