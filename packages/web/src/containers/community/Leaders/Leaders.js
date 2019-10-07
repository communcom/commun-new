/* eslint-disable no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';

import { Card, Loader, styles } from '@commun/ui';
import { Icon } from '@commun/icons';
import { Link } from 'shared/routes';

import { fetchLeaders } from 'store/actions/gate';
import Avatar from 'components/Avatar';
import InfinityScrollHelper from 'components/InfinityScrollHelper';

const Wrapper = styled(Card)`
  min-height: 100%;
  padding-top: 8px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
`;

const TabHeaderWrapper = styled.div`
  display: block;
`;

const Title = styled.h2`
  display: inline-block;
  font-size: 22px;
  letter-spacing: -0.41px;
  line-height: 22px;
  vertical-align: baseline;
`;

const LeadersCount = styled.span`
  display: inline-block;
  padding-left: 12px;
  font-size: 15px;
  letter-spacing: -0.41px;
  line-height: 15px;
  color: ${({ theme }) => theme.colors.contextGrey};
  vertical-align: baseline;

  ${up('tablet')} {
    padding-left: 24px;
  }
`;

const InviteButton = styled.button.attrs({ type: 'button' })`
  height: 100%;
  padding-left: 20px;
  font-size: 15px;
  letter-spacing: -0.41px;
  color: ${({ theme }) => theme.colors.communityColor};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.communityColorHover};
  }
`;

const LeadersList = styled.ul`
  margin-top: 8px;
`;

const LeadersItem = styled.li`
  display: flex;
  align-items: center;
  min-height: 64px;

  ${up('tablet')} {
    min-height: 80px;
  }
`;

const LeaderAvatar = styled(Avatar)`
  ${up('tablet')} {
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

  ${up('tablet')} {
    font-size: 17px;
  }
`;

const LeaderTitle = styled.div`
  font-size: 13px;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.colors.contextGrey};

  ${up('tablet')} {
    font-size: 15px;
  }
`;

const MenuButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 12px;
  margin-left: auto;
  color: ${({ theme }) => theme.colors.communityColor};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.communityColorHover};
  }

  ${up('tablet')} {
    display: none;
  }
`;

const IconStyled = styled(Icon)`
  width: 24px;
  height: 24px;
`;

const ActionsPanel = styled.ul`
  display: none;

  ${up('tablet')} {
    display: flex;
    margin-left: auto;
  }
`;

const ActionsItem = styled.li``;

const ActionButton = styled.button.attrs({ type: 'button' })`
  padding-left: 23px;
  color: ${({ theme }) => theme.colors.communityColor};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.communityColorHover};
  }
`;

const LoaderStyled = styled(Loader)`
  display: flex;
  justify-content: center;
  margin: 15px 0;
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
    sequenceKey: PropTypes.string,
    fetchLeaders: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sequenceKey: null,
  };

  static async getInitialProps({ query, store }) {
    await store.dispatch(
      fetchLeaders({
        communityId: query.communityId,
      })
    );

    return {
      communityId: query.communityId,
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

  inviteLeaderHandler = () => {
    // TODO: there will be inviteLeaderHandler
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
    const { communityId, isLoading, isEnd, sequenceKey, fetchLeaders } = this.props;

    if (isLoading || isEnd) {
      return;
    }

    fetchLeaders({ communityId, sequenceKey });
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
          <InviteButton onClick={this.inviteLeaderHandler}>+ New Leader</InviteButton>
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
            {isLoading ? <LoaderStyled /> : null}
          </LeadersList>
        </InfinityScrollHelper>
      </Wrapper>
    );
  }
}
