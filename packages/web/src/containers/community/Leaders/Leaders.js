/* eslint-disable no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import throttle from 'lodash.throttle';

import { PaginationLoader, Button, Search, styles, up } from '@commun/ui';

import { fetchLeaders } from 'store/actions/gate';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import AsyncAction from 'components/common/AsyncAction';
import LeaderAvatar from 'components/common/LeaderAvatar';
import { ProfileLink } from 'components/links';
import { displayError } from 'utils/toastsMessages';

import { leaderType } from 'types';
import {
  Wrapper,
  MenuButton,
  IconStyled,
  ActionsPanel,
  ActionsItem,
  ActionButton,
} from '../common';

const WrapperStyled = styled(Wrapper)`
  padding: 0;
`;

const HeaderStyled = styled.header`
  display: flex;
  padding: 20px 16px 10px;
`;

const SearchStyled = styled(Search)`
  flex-grow: 1;
  margin-right: 10px;
  border: none;
  background-color: ${({ theme }) => theme.colors.contextWhite};

  & input {
    &,
    &::placeholder {
      font-size: 15px;
    }
  }
`;

const LeadersList = styled.ul``;

const LeadersItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0 16px;
  min-height: 64px;

  &:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.contextWhite};
  }

  ${up.tablet} {
    min-height: 80px;
  }
`;

const LeaderNameWrapper = styled.div`
  height: 100%;
  margin-left: 16px;
`;

const LeaderLink = styled.a`
  display: block;
  padding-bottom: 4px;
  font-size: 15px;
  letter-spacing: -0.3px;
  ${styles.overflowEllipsis};
  color: #000;
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.communityColor};
  }

  ${up.tablet} {
    font-size: 17px;
  }
`;

const LeaderTitle = styled.div`
  font-size: 13px;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.colors.contextGrey};

  ${up.tablet} {
    font-size: 15px;
  }
`;

const PaginationLoaderStyled = styled(PaginationLoader)`
  padding-bottom: 20px;
`;

const EmptyList = styled.div`
  padding: 15px 16px 30px;
`;

export default class Leaders extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(leaderType).isRequired,
    isEnd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    userId: PropTypes.string,
    prefix: PropTypes.string,
    fetchPrefix: PropTypes.string,
    fetchLeaders: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
    openBecomeLeaderDialog: PropTypes.func.isRequired,
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
  };

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

  getActions = () => [
    /*
    {
      action: 'Message to leader',
      icon: 'chat',
      handler: this.writeMessageHandler,
    },
    {
      action: "Change leader's title",
      icon: 'edit',
      handler: this.changeTitleHandler,
    },
    {
      action: 'Delete leader',
      icon: 'delete',
      handler: this.deleteLeaderHandler,
    },
    */
  ];

  openMenuHandler = () => {
    // TODO: there will be openMenuHandler
  };

  onBecomeLeaderClick = async () => {
    const { communityId, openBecomeLeaderDialog, fetchLeaders, waitForTransaction } = this.props;

    const results = await openBecomeLeaderDialog({ communityId });

    if (results) {
      await waitForTransaction(results.transactionId);
      await fetchLeaders({
        communityId,
        offset: 0,
      });
    }
  };

  writeMessageHandler = () => {
    // TODO: there will be writeMessageHandler
  };

  changeTitleHandler = () => {
    // TODO: there will be changeTitleHandler
  };

  deleteLeaderHandler = () => {
    // TODO: there will be deleteLeaderHandler
  };

  renderActionPanel = () => {};

  onSearchChange = e => {
    this.setState(
      {
        searchText: e.target.value,
      },
      this.onNeedLoadLazy
    );
  };

  render() {
    const { items, isEnd, isLoading, prefix, userId } = this.props;
    const { searchText } = this.state;

    return (
      <WrapperStyled>
        <HeaderStyled>
          <SearchStyled value={searchText} onChange={this.onSearchChange} />
          {userId ? (
            <AsyncAction onClickHandler={this.onBecomeLeaderClick}>
              <Button>Become a Leader</Button>
            </AsyncAction>
          ) : null}
        </HeaderStyled>
        <InfinityScrollHelper disabled={isEnd || isLoading} onNeedLoadMore={this.onNeedLoad}>
          <LeadersList>
            {items.map(({ userId, username, rating }) => (
              <LeadersItem key={userId}>
                <ProfileLink user={username} allowEmpty>
                  <LeaderAvatar userId={userId} percent={0.38} useLink />
                </ProfileLink>
                <LeaderNameWrapper>
                  <ProfileLink user={username} allowEmpty>
                    <LeaderLink>{username || `id: ${userId}`}</LeaderLink>
                  </ProfileLink>
                  <LeaderTitle>rating: {rating}</LeaderTitle>
                </LeaderNameWrapper>
                <MenuButton aria-label="More actions" onClick={this.openMenuHandler}>
                  <IconStyled name="more" />
                </MenuButton>
                <ActionsPanel>
                  {this.getActions().map(({ action, icon, handler }) => (
                    <ActionsItem key={action}>
                      <ActionButton aria-label={action} onClick={handler}>
                        <IconStyled name={icon} />
                      </ActionButton>
                    </ActionsItem>
                  ))}
                </ActionsPanel>
              </LeadersItem>
            ))}
          </LeadersList>
          {isLoading ? <PaginationLoaderStyled /> : null}
          {!isLoading && items.length === 0 && prefix ? (
            <EmptyList>Nothing is found</EmptyList>
          ) : null}
        </InfinityScrollHelper>
      </WrapperStyled>
    );
  }
}
