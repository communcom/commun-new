/* eslint-disable no-shadow */
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import { PaginationLoader } from '@commun/ui';
import { userType } from 'types';
import { displayError } from 'utils/toastsMessages';

import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import CommunityRow from 'components/common/CommunityRow';
import EmptyList from 'components/common/EmptyList';
import { Wrapper, TopWrapper, Items, SearchStyled } from '../common';

export default function CommunitiesBlacklist({
  userId,
  items,
  isEnd,
  isLoading,
  fetchCommunitiesBlacklist,
}) {
  const [filterText, setFilterText] = useState('');

  const filteredItems = useMemo(() => {
    if (filterText.trim()) {
      const filterTextLower = filterText.toLowerCase().trim();
      const filtered = items.filter(({ alias }) => alias.toLowerCase().includes(filterTextLower));

      return filtered;
    }

    return items;
  }, [items, filterText]);

  function onFilterChange(e) {
    setFilterText(e.target.value);
  }

  async function onNeedLoadMore() {
    if (isLoading || isEnd) {
      return;
    }

    try {
      await fetchCommunitiesBlacklist({
        userId,
        offset: items.length,
      });
    } catch (err) {
      displayError(err);
    }
  }

  function renderEmpty() {
    if (items.length) {
      return <EmptyList headerText="Nothing is found" noIcon />;
    }

    return <EmptyList headerText="No blocked communities" />;
  }

  function renderItems() {
    let finalItems = items;

    if (filterText.trim()) {
      finalItems = filteredItems;
    }

    return (
      <>
        <InfinityScrollHelper disabled={isEnd || isLoading} onNeedLoadMore={onNeedLoadMore}>
          <Items>
            {finalItems.map(({ communityId }) => (
              <CommunityRow communityId={communityId} key={communityId} isBlacklist />
            ))}
          </Items>
        </InfinityScrollHelper>
        {isLoading ? <PaginationLoader /> : null}
        {!isLoading && finalItems.length === 0 ? renderEmpty() : null}
      </>
    );
  }

  return (
    <Wrapper>
      {items.length ? (
        <TopWrapper>
          <SearchStyled
            name="communities-blacklist__search-communities-input"
            inverted
            label="Search"
            type="search"
            placeholder="Search..."
            value={filterText}
            onChange={onFilterChange}
          />
        </TopWrapper>
      ) : null}
      {renderItems()}
    </Wrapper>
  );
}

CommunitiesBlacklist.propTypes = {
  userId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isEnd: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(userType).isRequired,

  fetchCommunitiesBlacklist: PropTypes.func.isRequired,
};
