/* eslint-disable no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { PaginationLoader, TextButton, styles, up } from '@commun/ui';
import { Link } from 'shared/routes';

import { fetchLeaders } from 'store/actions/gate';
import Avatar from 'components/common/Avatar';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import AsyncAction from 'components/common/AsyncAction';

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
    leaders: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        avatarUrl: PropTypes.string,
      })
    ).isRequired,
    isEnd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    fetchLeaders: PropTypes.func.isRequired,
    becomeLeader: PropTypes.func.isRequired,
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
    const { communityId, becomeLeader } = this.props;
    await becomeLeader({ communityId });
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
    const { communityId, leaders, isLoading, isEnd, fetchLeaders } = this.props;

    if (isLoading || isEnd) {
      return;
    }

    fetchLeaders({
      communityId,
      offset: leaders.length,
    });
  };

  render() {
    const { leaders, isEnd, isLoading } = this.props;

    return (
      <Wrapper>
        <Header>
          <TabHeaderWrapper>
            <Title>Leaders</Title>
            <LeadersCount>{leaders.length}</LeadersCount>
          </TabHeaderWrapper>
          <ButtonsBar>
            <AsyncAction onClickHandler={this.onBecomeLeaderClick}>
              <TextButton>+ Become a Leader</TextButton>
            </AsyncAction>
          </ButtonsBar>
        </Header>
        <InfinityScrollHelper disabled={isEnd || isLoading} onNeedLoadMore={this.onNeedLoadMore}>
          <LeadersList>
            {leaders.map(({ userId, username, title }) => (
              <LeadersItem key={username}>
                <LeaderAvatar userId={userId} useLink />
                <LeaderNameWrapper>
                  <Link route="profile" params={{ username }} passHref>
                    <LeaderLink>{username}</LeaderLink>
                  </Link>
                  <LeaderTitle>{title}</LeaderTitle>
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
