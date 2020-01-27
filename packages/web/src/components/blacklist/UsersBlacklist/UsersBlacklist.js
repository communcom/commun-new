/* eslint-disable no-shadow */
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import { PaginationLoader } from '@commun/ui';
import { userType } from 'types';
import { displayError } from 'utils/toastsMessages';

import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import UserRow from 'components/common/UserRow';
import EmptyList from 'components/common/EmptyList';
import { Wrapper, TopWrapper, Items, SearchStyled } from '../common';

export default function UsersBlacklist({ userId, items, isEnd, isLoading, fetchUsersBlacklist }) {
  const [filterText, setFilterText] = useState('');

  const filteredItems = useMemo(() => {
    if (filterText.trim()) {
      const filterTextLower = filterText.toLowerCase().trim();
      const filtered = items.filter(({ username }) =>
        username.toLowerCase().includes(filterTextLower)
      );

      return filtered;
    }

    return items;
  }, [items, filterText]);

  async function onNeedLoadMore() {
    if (isLoading || isEnd) {
      return;
    }

    try {
      await fetchUsersBlacklist({
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

    return <EmptyList headerText="No blocked users" />;
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
            {finalItems.map(({ userId }) => (
              <UserRow userId={userId} key={userId} isBlacklist />
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
            name="users-blacklist__search-user-input"
            inverted
            label="Search"
            type="search"
            placeholder="Search..."
            value={filterText}
            onChange={setFilterText}
          />
        </TopWrapper>
      ) : null}
      {renderItems()}
    </Wrapper>
  );
}

UsersBlacklist.propTypes = {
  userId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isEnd: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(userType).isRequired,

  fetchUsersBlacklist: PropTypes.func.isRequired,
};
