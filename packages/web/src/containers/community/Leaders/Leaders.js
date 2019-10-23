/* eslint-disable no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { PaginationLoader, TextButton, styles, up } from '@commun/ui';

import { fetchLeaders } from 'store/actions/gate';
import Avatar from 'components/common/Avatar';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import AsyncAction from 'components/common/AsyncAction';
import { ProfileLink } from 'components/links';

import { leaderType } from 'types';
import {
  Wrapper,
  Header,
  TabHeaderWrapper,
  Title,
  MenuButton,
  IconStyled,
  ActionsPanel,
  ActionsItem,
  ActionButton,
  ButtonsBar,
} from '../common';

const LeadersCount = styled.span`
  display: inline-block;
  padding-left: 12px;
  font-size: 15px;
  letter-spacing: -0.41px;
  line-height: 15px;
  color: ${({ theme }) => theme.colors.contextGrey};
  vertical-align: baseline;

  ${up.tablet} {
    padding-left: 24px;
  }
`;

const LeadersList = styled.ul`
  margin-top: 8px;
`;

const LeadersItem = styled.li`
  display: flex;
  align-items: center;
  min-height: 64px;

  ${up.tablet} {
    min-height: 80px;
  }
`;

const LeaderAvatar = styled(Avatar)`
  ${up.tablet} {
    width: 56px;
    height: 56px;
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

export default class Leaders extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(leaderType).isRequired,
    isEnd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    userId: PropTypes.string,
    fetchLeaders: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
    openBecomeLeaderDialog: PropTypes.func.isRequired,
  };

  static defaultProps = {
    userId: null,
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

  onNeedLoadMore = () => {
    const { communityId, items, isLoading, isEnd, fetchLeaders } = this.props;

    if (isLoading || isEnd) {
      return;
    }

    fetchLeaders({
      communityId,
      offset: items.length,
    });
  };

  render() {
    const { items, isEnd, isLoading, userId } = this.props;

    return (
      <Wrapper>
        <Header>
          <TabHeaderWrapper>
            <Title>Leaders</Title>
            <LeadersCount>{items.length}</LeadersCount>
          </TabHeaderWrapper>
          {userId ? (
            <ButtonsBar>
              <AsyncAction onClickHandler={this.onBecomeLeaderClick}>
                <TextButton>+ Become a Leader</TextButton>
              </AsyncAction>
            </ButtonsBar>
          ) : null}
        </Header>
        <InfinityScrollHelper disabled={isEnd || isLoading} onNeedLoadMore={this.onNeedLoadMore}>
          <LeadersList>
            {items.map(({ userId, username, rating }) => (
              <LeadersItem key={userId}>
                <LeaderAvatar userId={userId} useLink />
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
            {isLoading ? <PaginationLoader /> : null}
          </LeadersList>
        </InfinityScrollHelper>
      </Wrapper>
    );
  }
}
