/* eslint-disable no-shadow, no-nested-ternary */
/* stylelint-disable no-descending-specificity */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { PaginationLoader, up } from '@commun/ui';

import { COMMUNITIES_FETCH_LIMIT } from 'shared/constants';
import { useTranslation } from 'shared/i18n';
import { fetchLeaders } from 'store/actions/gate';
import useSearch, { searchInitialState } from 'utils/hooks/useSearch';
import { displayError } from 'utils/toastsMessages';
import { fancyScrollTo } from 'utils/ui';
import { normalizeCyberwayErrorMessage } from 'utils/errors';

import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import SearchInput from 'components/common/SearchInput';
import EmptyList from 'components/common/EmptyList';
import AsyncButton from 'components/common/AsyncButton';
import LeaderRow from 'components/common/LeaderRow';
import TabLoader from 'components/common/TabLoader';
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
  background-color: ${({ theme }) => theme.colors.white};
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
    background-color: ${({ theme }) => theme.colors.white};
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
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isShowLoader, setIsShowLoader] = useState(false);
  const unmount = useRef(false);
  const loaderRef = useRef(null);

  useEffect(
    () => () => {
      unmount.current = true;
    },
    []
  );

  useEffect(() => {
    if (isShowLoader && loaderRef.current) {
      fancyScrollTo(loaderRef.current);
    }
  }, [isShowLoader]);

  async function loadData(params) {
    return fetchLeaders({
      communityId,
      prefix: params.searchText,
      offset: params.offset,
      limit: params.limit,
    });
  }

  const { searchState, searchText, setSearchText, onNeedLoad } = useSearch({
    initialState: reducerInitialState,
    limit: COMMUNITIES_FETCH_LIMIT,
    loadData,
  });

  const onBecomeLeaderClick = async () => {
    const results = await openBecomeLeaderDialog({ communityId });

    if (results) {
      setIsProcessing(true);
      setIsShowLoader(true);

      try {
        await waitForTransaction(results.transactionId);
        await onNeedLoad(true);
      } catch (err) {
        displayError(err);
      }

      setIsShowLoader(false);
      setIsProcessing(false);
    }
  };

  const onStopLeaderClick = async () => {
    if (!(await openConfirmDialog())) {
      return;
    }

    setIsProcessing(true);

    try {
      let results;

      if (!isStoppedLeader) {
        try {
          await stopLeader({ communityId });
        } catch (err) {
          const message = normalizeCyberwayErrorMessage(err);
          if (message !== 'active flag not updated') {
            throw err;
          }
        }
      }

      try {
        await clearAllVotes({ communityId });
        results = await unregLeader({ communityId });
      } catch (err) {
        displayError(err);
      }

      if (results) {
        setIsShowLoader(true);

        try {
          await waitForTransaction(results.transaction_id);
          await onNeedLoad(true);
        } catch (err) {
          displayError(err);
        }

        setIsShowLoader(false);
      }
    } catch (err) {
      displayError(err);
    }

    setIsProcessing(false);
  };

  function renderTopActions() {
    return (
      <AsyncButton
        disabled={isProcessing || isShowLoader}
        isProcessing={isProcessing}
        onClick={isLeader ? onStopLeaderClick : onBecomeLeaderClick}
      >
        {isLeader
          ? t('components.community.leaders.stop')
          : t('components.community.leaders.become')}
      </AsyncButton>
    );
  }

  function renderEmptyList() {
    if (searchText) {
      return <EmptyList>{t('components.community.leaders.no_found')}</EmptyList>;
    }

    return (
      <EmptyList
        headerText={t('components.community.leaders.empty')}
        subText={t('components.community.leaders.empty_desc')}
      >
        <AsyncButton
          disabled={isProcessing || isShowLoader}
          isProcessing={isProcessing}
          onClick={onBecomeLeaderClick}
        >
          {t('components.community.leaders.become')}
        </AsyncButton>
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
      return <TabLoader ref={loaderRef} />;
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
              {t('components.community.leaders.leaders')}
              {isMobile && userId ? renderTopActions() : null}
            </ListHeader>
            {renderLeadersList(leaders)}
          </ListWrapper>
        ) : null}
        {nominees.length ? (
          <ListWrapper>
            <ListHeader>{t('components.community.leaders.nominees')}</ListHeader>
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
