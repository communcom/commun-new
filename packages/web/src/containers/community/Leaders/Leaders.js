/* eslint-disable no-shadow,class-methods-use-this */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import throttle from 'lodash.throttle';

import { PaginationLoader, Button, styles, up } from '@commun/ui';

import { leaderType } from 'types';
import { fetchLeaders } from 'store/actions/gate';
import { displayError, displaySuccess } from 'utils/toastsMessages';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import AsyncAction from 'components/common/AsyncAction';
import SearchInput from 'components/common/SearchInput';
import LeaderAvatar from 'components/common/LeaderAvatar';
import { ProfileLink } from 'components/links';

import { Wrapper, ActionsPanel, ActionsItem } from '../common';

const WrapperStyled = styled(Wrapper)`
  padding: 0;
  margin-bottom: 8px;
`;

const HeaderStyled = styled.header`
  display: flex;
  padding: 20px 16px 10px;

  & > :not(:first-child) {
    margin-left: 10px;
  }
`;

const LeadersList = styled.ul``;

const LeadersItem = styled.li`
  padding: 0 15px;

  &:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.lightGrayBlue};
  }
`;

const LeaderItemContent = styled.div`
  display: flex;
  align-items: center;
  min-height: 64px;

  ${up.tablet} {
    min-height: 80px;
  }
`;

const LeaderTextBlock = styled.div`
  margin: -2px 0 0 16px;
`;

const LeaderNameWrapper = styled.div``;

const LeaderName = styled.a`
  padding-bottom: 4px;
  font-size: 15px;
  font-weight: 600;
  ${styles.overflowEllipsis};
  color: #000;
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }

  ${up.tablet} {
    font-size: 17px;
  }
`;

const LeaderTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};

  ${up.tablet} {
    font-size: 12px;
  }
`;

const PaginationLoaderStyled = styled(PaginationLoader)`
  padding-bottom: 20px;
`;

const EmptyList = styled.div`
  padding: 20px 16px 50px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};
`;

const RatingPercent = styled.span`
  color: ${({ theme }) => theme.colors.blue};
`;

const InactiveStatus = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray};
`;

const WelcomeUrlBlock = styled.div`
  padding-bottom: 15px;
`;

export default class Leaders extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(leaderType).isRequired,
    isEnd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isLeader: PropTypes.bool.isRequired,
    isStoppedLeader: PropTypes.bool.isRequired,
    userId: PropTypes.string,
    prefix: PropTypes.string,
    fetchPrefix: PropTypes.string,

    fetchLeaders: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
    openBecomeLeaderDialog: PropTypes.func.isRequired,
    openConfirmDialog: PropTypes.func.isRequired,
    voteLeader: PropTypes.func.isRequired,
    unVoteLeader: PropTypes.func.isRequired,
    stopLeader: PropTypes.func.isRequired,
    clearAllVotes: PropTypes.func.isRequired,
    unregLeader: PropTypes.func.isRequired,
  };

  static defaultProps = {
    userId: null,
    prefix: null,
    fetchPrefix: null,
  };

  static async getInitialProps({ parentInitialProps, store }) {
    const { communityId } = parentInitialProps;

    await store.dispatch(
      fetchLeaders({
        communityId,
      })
    );

    return {
      communityId,
    };
  }

  state = {
    searchText: '',
    isShowLoader: false,
  };

  componentWillUnmount() {
    this.unmount = true;
  }

  onNeedLoad = isSearching => {
    const { isLoading, isEnd, prefix, fetchPrefix } = this.props;
    const { searchText } = this.state;
    const newPrefix = searchText.trim() || null;

    if (isSearching) {
      if (isLoading && (fetchPrefix || null) === newPrefix) {
        return;
      }

      if (!isLoading && (prefix || null) === newPrefix) {
        return;
      }

      this.loadLeaders();
      return;
    }

    if (isLoading || isEnd) {
      return;
    }

    this.loadLeaders(true);
  };

  onNeedLoadLazy = throttle(() => this.onNeedLoad(true), 500, { leading: false });

  loadLeaders = async isPaging => {
    const { communityId, items, fetchLeaders } = this.props;
    const { searchText } = this.state;

    try {
      await fetchLeaders({
        communityId,
        prefix: searchText.trim() || undefined,
        offset: isPaging ? items.length : 0,
      });
    } catch (err) {
      displayError(err);
    }
  };

  onBecomeLeaderClick = async () => {
    const { communityId, openBecomeLeaderDialog, fetchLeaders, waitForTransaction } = this.props;

    const results = await openBecomeLeaderDialog({ communityId });

    if (results) {
      setTimeout(async () => {
        this.setState({
          isShowLoader: true,
        });

        try {
          await waitForTransaction(results.transactionId);
          await fetchLeaders({
            communityId,
            offset: 0,
          });
        } finally {
          this.setState({
            isShowLoader: false,
          });
        }
      }, 0);
    }
  };

  onStopLeaderClick = async () => {
    const {
      isStoppedLeader,
      communityId,
      openConfirmDialog,
      stopLeader,
      clearAllVotes,
      unregLeader,
      waitForTransaction,
      fetchLeaders,
    } = this.props;

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
            this.setState({
              isShowLoader: true,
            });

            await waitForTransaction(results.transaction_id);
            await fetchLeaders({
              communityId,
              offset: 0,
            });
          } finally {
            this.setState({
              isShowLoader: false,
            });
          }
        });
      }
    }
  };

  onVoteClick = async (leaderId, isVote) => {
    const { communityId, voteLeader, unVoteLeader, waitForTransaction } = this.props;

    const action = isVote ? voteLeader : unVoteLeader;

    const { transaction_id: trxId } = await action({ communityId, leaderId });

    if (isVote) {
      displaySuccess('Successfully voted');
    } else {
      displaySuccess('Vote canceled');
    }

    setTimeout(async () => {
      this.setState({
        isShowLoader: true,
      });

      try {
        await waitForTransaction(trxId);

        if (!this.unmount) {
          await this.loadLeaders();
        }
      } finally {
        if (!this.unmount) {
          this.setState({
            isShowLoader: false,
          });
        }
      }
    }, 0);
  };

  onSearchChange = e => {
    this.setState(
      {
        searchText: e.target.value,
      },
      this.onNeedLoadLazy
    );
  };

  renderTopActions() {
    const { isLeader } = this.props;
    const { isShowLoader } = this.state;

    if (isLeader) {
      return (
        <AsyncAction onClickHandler={this.onStopLeaderClick}>
          <Button disabled={isShowLoader}>Stop be a leader</Button>
        </AsyncAction>
      );
    }

    return (
      <AsyncAction onClickHandler={this.onBecomeLeaderClick}>
        <Button disabled={isShowLoader}>Become a Leader</Button>
      </AsyncAction>
    );
  }

  renderUrlBlock(url) {
    let content;

    if (/^(https?:)?\/\//.test(url)) {
      content = (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      );
    } else {
      content = url;
    }

    return <WelcomeUrlBlock>{content}</WelcomeUrlBlock>;
  }

  renderItem({ userId, username, url, rating, ratingPercent, isActive, isVoted }) {
    return (
      <LeadersItem key={userId}>
        <LeaderItemContent>
          <ProfileLink user={username} allowEmpty>
            <LeaderAvatar userId={userId} percent={ratingPercent} useLink />
          </ProfileLink>
          <LeaderTextBlock>
            <LeaderNameWrapper>
              <ProfileLink user={username} allowEmpty>
                <LeaderName>{username || `id: ${userId}`}</LeaderName>
              </ProfileLink>
              {isActive ? null : (
                <>
                  {' '}
                  <InactiveStatus>(inactive)</InactiveStatus>
                </>
              )}
            </LeaderNameWrapper>
            <LeaderTitle>
              {rating} points • <RatingPercent>{Math.round(ratingPercent * 100)}%</RatingPercent>
            </LeaderTitle>
          </LeaderTextBlock>
          {typeof isVoted === 'boolean' ? (
            <ActionsPanel>
              <ActionsItem>
                <AsyncAction onClickHandler={() => this.onVoteClick(userId, !isVoted)}>
                  <Button primary={!isVoted}>{isVoted ? 'Voted' : 'Vote'}</Button>
                </AsyncAction>
              </ActionsItem>
            </ActionsPanel>
          ) : null}
        </LeaderItemContent>
        {url ? this.renderUrlBlock(url) : null}
      </LeadersItem>
    );
  }

  renderContent() {
    const { items, isEnd, isLoading } = this.props;
    const { isShowLoader } = this.state;

    if (isShowLoader) {
      return <PaginationLoaderStyled />;
    }

    return (
      <InfinityScrollHelper disabled={isEnd || isLoading} onNeedLoadMore={this.onNeedLoad}>
        <LeadersList>{items.map(item => this.renderItem(item))}</LeadersList>
        {isLoading ? <PaginationLoaderStyled /> : null}
        {items.length === 0 && !isLoading ? this.renderEmptyList() : null}
      </InfinityScrollHelper>
    );
  }

  renderEmptyList() {
    const { prefix } = this.props;

    return <EmptyList>{prefix ? 'Nothing is found' : 'List is empty'}</EmptyList>;
  }

  render() {
    const { userId } = this.props;
    const { searchText } = this.state;

    return (
      <WrapperStyled>
        <HeaderStyled>
          <SearchInput value={searchText} onChange={this.onSearchChange} />
          {userId ? this.renderTopActions() : null}
        </HeaderStyled>
        {this.renderContent()}
      </WrapperStyled>
    );
  }
}
