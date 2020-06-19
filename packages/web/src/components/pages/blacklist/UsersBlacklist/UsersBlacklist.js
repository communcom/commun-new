/* eslint-disable no-shadow */
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { PaginationLoader } from '@commun/ui';

import { userType } from 'types';
import { useTranslation } from 'shared/i18n';
import { displayError } from 'utils/toastsMessages';

import EmptyList from 'components/common/EmptyList';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import TabLoader from 'components/common/TabLoader';
import UserRow from 'components/common/UserRow';
import { Items, SearchStyled, TopWrapper, Wrapper } from '../common';

function UsersBlacklist({ userId, items, isEnd, isLoading, fetchUsersBlacklist }) {
  const { t } = useTranslation();
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
      return <EmptyList noIcon />;
    }

    return <EmptyList headerText={t('components.blacklist.users_blacklist.no_found')} />;
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

  if (isLoading && !items.length) {
    return (
      <Wrapper>
        <TabLoader />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {items.length ? (
        <TopWrapper>
          <SearchStyled
            name="users-blacklist__search-user-input"
            inverted
            label={t('common.search')}
            type="search"
            placeholder={t('common.search_placeholder')}
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

export default UsersBlacklist;
