/* eslint-disable no-shadow, no-nested-ternary */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { PaginationLoader, Button, up } from '@commun/ui';

import { searchInitialState, useSearch } from 'utils/hooks/useSearch';
import { COMMUNITIES_FETCH_LIMIT } from 'shared/constants';

import { fetchLeaders } from 'store/actions/gate';
import { displayError } from 'utils/toastsMessages';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import AsyncAction from 'components/common/AsyncAction';
import SearchInput from 'components/common/SearchInput';
import EmptyList from 'components/common/EmptyList';

import LeaderRow from 'components/common/LeaderRow';
import { Wrapper } from '../common';

const WrapperStyled = styled(Wrapper)`
  padding: 12px 10px 0;
  margin-bottom: 8px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};

  ${up.tablet} {
    padding: 0;
    background-color: #fff;
    overflow: hidden;
  }
`;

const HeaderStyled = styled.header`
  display: flex;
  padding: 20px 16px 10px;

  & > :not(:first-child) {
    margin-left: 10px;
  }
`;

const HeaderWrapperMobile = styled.header`
  padding: 15px;
  background-color: #fff;
  margin-bottom: 20px;
  border-radius: 10px;
`;

const HeaderMobile = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const TabTitle = styled.span`
  font-weight: bold;
  font-size: 21px;
  line-height: 1;
  white-space: nowrap;
`;

const LeadersList = styled.ul`
  border-radius: 10px;
  overflow: hidden;

  & > :not(:last-child) {
    margin-bottom: 2px;
  }

  ${up.tablet} {
    border-radius: 0;
    background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  }
`;

const PaginationLoaderStyled = styled(PaginationLoader)`
  padding-bottom: 20px;
`;

export default function Leaders({
  reducerInitialState,
  userId,
  communityId,
  fetchLeaders,
  openBecomeLeaderDialog,
  waitForTransaction,
  isStoppedLeader,
  isLeader,
  isMobile,
  openConfirmDialog,
  stopLeader,
  clearAllVotes,
  unregLeader,
}) {
  const [isShowLoader, setIsShowLoader] = useState(false);
  const unmount = useRef(false);

  useEffect(
    () => () => {
      unmount.current = true;
    },
    []
  );

  async function loadData(params) {
    return fetchLeaders({
      communityId,
      prefix: params.search,
      ...params,
    });
  }

  const [searchState, searchText, setSearchText, onNeedLoad] = useSearch({
    initialState: reducerInitialState,
    limit: COMMUNITIES_FETCH_LIMIT,
    loadData,
  });

  const onBecomeLeaderClick = async () => {
    const results = await openBecomeLeaderDialog({ communityId });

    if (results) {
      setTimeout(async () => {
        setIsShowLoader(true);

        try {
          await waitForTransaction(results.transactionId);
          await onNeedLoad(true);
        } finally {
          setIsShowLoader(false);
        }
      }, 0);
    }
  };

  const onStopLeaderClick = async () => {
    if (await openConfirmDialog()) {
      let results;

      if (!isStoppedLeader) {
        await stopLeader({ communityId });
      }

      try {
        await clearAllVotes({ communityId });
        results = await unregLeader({ communityId });
      } catch (err) {
        displayError(err);
      }

      if (results) {
        setTimeout(async () => {
          try {
            setIsShowLoader(true);

            await waitForTransaction(results.transaction_id);
            await onNeedLoad(true);
          } finally {
            setIsShowLoader(false);
          }
        });
      }
    }
  };

  function renderTopActions() {
    if (isLeader) {
      return (
        <AsyncAction onClickHandler={onStopLeaderClick}>
          <Button disabled={isShowLoader}>Stop be a leader</Button>
        </AsyncAction>
      );
    }

    return (
      <AsyncAction onClickHandler={onBecomeLeaderClick}>
        <Button disabled={isShowLoader}>Become a Leader</Button>
      </AsyncAction>
    );
  }

  function renderEmptyList() {
    if (searchText) {
      return <EmptyList>Nothing is found</EmptyList>;
    }

    return (
      <EmptyList headerText="No Leaders" subText="Be the first community leader">
        <AsyncAction onClickHandler={onBecomeLeaderClick}>
          <Button>Become a Leader</Button>
        </AsyncAction>
      </EmptyList>
    );
  }

  function onVote() {
    onNeedLoad(true);
  }

  function renderContent() {
    if (isShowLoader) {
      return <PaginationLoaderStyled />;
    }

    return (
      <InfinityScrollHelper
        disabled={searchState.isEnd || searchState.isLoading}
        onNeedLoadMore={onNeedLoad}
      >
        <LeadersList>
          {searchState.items.map(({ userId, communityId }) => (
            <LeaderRow
              key={userId}
              userId={userId}
              communityId={communityId}
              onVote={onVote}
              onChangeLoader={setIsShowLoader}
            />
          ))}
        </LeadersList>
        {searchState.isLoading ? <PaginationLoaderStyled /> : null}
        {!searchState.items.length && !searchState.isLoading ? renderEmptyList() : null}
      </InfinityScrollHelper>
    );
  }

  return (
    <WrapperStyled>
      {isMobile ? (
        searchState.items.length ? (
          <HeaderWrapperMobile>
            <HeaderMobile>
              <TabTitle>Leaders</TabTitle>
              {userId ? renderTopActions() : null}
            </HeaderMobile>
            <SearchInput value={searchText} onChange={setSearchText} />
          </HeaderWrapperMobile>
        ) : null
      ) : (
        <HeaderStyled>
          <SearchInput value={searchText} onChange={setSearchText} />
          {userId ? renderTopActions() : null}
        </HeaderStyled>
      )}
      {renderContent()}
    </WrapperStyled>
  );
}

Leaders.getInitialProps = async ({ parentInitialProps, store }) => {
  const { communityId } = parentInitialProps;

  const result = await store.dispatch(
    fetchLeaders({
      communityId,
    })
  );

  return {
    reducerInitialState: {
      ...searchInitialState,
      items: result.items,
    },
    communityId,
  };
};

Leaders.propTypes = {
  reducerInitialState: PropTypes.shape({}).isRequired,
  communityId: PropTypes.string.isRequired,
  isLeader: PropTypes.bool.isRequired,
  isStoppedLeader: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  isMobile: PropTypes.bool.isRequired,

  fetchLeaders: PropTypes.func.isRequired,
  waitForTransaction: PropTypes.func.isRequired,
  openBecomeLeaderDialog: PropTypes.func.isRequired,
  openConfirmDialog: PropTypes.func.isRequired,
  stopLeader: PropTypes.func.isRequired,
  clearAllVotes: PropTypes.func.isRequired,
  unregLeader: PropTypes.func.isRequired,
};

Leaders.defaultProps = {
  userId: null,
};
