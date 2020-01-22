/* eslint-disable no-shadow, no-nested-ternary */
/* stylelint-disable no-descending-specificity */
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
    overflow: hidden;
  }
`;

const HeaderStyled = styled.header`
  display: flex;
  padding: 15px;
  background-color: #fff;
  margin-bottom: 15px;
  border-radius: 10px;

  ${up.tablet} {
    margin-bottom: 10px;
    border-radius: 6px;
  }

  & > :not(:first-child) {
    margin-left: 10px;
  }
`;

const ListWrapper = styled.section`
  border-radius: 6px;
  overflow: hidden;

  &:not(:last-child) {
    margin-bottom: 15px;

    ${up.tablet} {
      margin-bottom: 10px;
    }
  }
`;

const ListHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  padding: 0 10px;
  font-weight: bold;
  font-size: 16px;
  line-height: 100%;

  ${up.tablet} {
    height: unset;
    padding: 20px 15px 10px;
    background-color: #fff;
  }
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

  function renderLeadersList(items) {
    return (
      <LeadersList>
        {items.map(({ userId, communityId }) => (
          <LeaderRow
            key={userId}
            userId={userId}
            communityId={communityId}
            onVote={onVote}
            onChangeLoader={setIsShowLoader}
          />
        ))}
      </LeadersList>
    );
  }

  function renderContent() {
    if (isShowLoader) {
      return <PaginationLoaderStyled />;
    }

    const leaders = [];
    const nominees = [];

    for (const item of searchState.items) {
      if (item.inTop) {
        leaders.push(item);
      } else {
        nominees.push(item);
      }
    }

    return (
      <InfinityScrollHelper
        disabled={searchState.isEnd || searchState.isLoading}
        onNeedLoadMore={onNeedLoad}
      >
        {leaders.length ? (
          <ListWrapper>
            <ListHeader>
              Leaders
              {isMobile && userId ? renderTopActions() : null}
            </ListHeader>
            {renderLeadersList(leaders)}
          </ListWrapper>
        ) : null}
        {nominees.length ? (
          <ListWrapper>
            <ListHeader>Nominees</ListHeader>
            {renderLeadersList(nominees)}
          </ListWrapper>
        ) : null}
        {searchState.isLoading ? <PaginationLoaderStyled /> : null}
        {!searchState.items.length && !searchState.isLoading ? renderEmptyList() : null}
      </InfinityScrollHelper>
    );
  }

  return (
    <WrapperStyled>
      <HeaderStyled>
        <SearchInput value={searchText} onChange={setSearchText} />
        {!isMobile && userId ? renderTopActions() : null}
      </HeaderStyled>

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
