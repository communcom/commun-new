import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';

import { Card, Search, styles } from '@commun/ui';
import { Icon } from '@commun/icons';
import { Link } from 'shared/routes';

import Avatar from 'components/Avatar';

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

const MembersCount = styled.span`
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

const MembersList = styled.ul`
  margin-top: 8px;
`;

const MembersItem = styled.li`
  display: flex;
  align-items: center;
  min-height: 64px;

  ${up('tablet')} {
    min-height: 80px;
  }
`;

const MemberAvatar = styled(Avatar)`
  ${up('tablet')} {
    width: 56px;
    height: 56px;
  }
`;

const MemberLink = styled.a`
  display: block;
  height: 100%;
  margin-left: 16px;
  font-size: 15px;
  letter-spacing: -0.3px;
  ${styles.overflowEllipsis};
  color: #000;
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: #4c4c4c;
  }

  ${up('tablet')} {
    font-size: 17px;
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

export default class MembersTab extends PureComponent {
  // eslint-disable-next-line
  static async getInitialProps({ query, store }) {
    // TODO: Place here fetch data logic
  }

  static propTypes = {
    members: PropTypes.arrayOf(
      PropTypes.shape({
        username: PropTypes.string.isRequired,
        name: PropTypes.string,
      })
    ).isRequired,
  };

  state = {
    filterText: '',
  };

  getActions = () => [
    {
      action: 'Message to member',
      icon: 'chat',
      handler: this.writeMessageHandler,
    },
    {
      action: 'Delete member',
      icon: 'delete',
      handler: this.deleteMemberHandler,
    },
  ];

  getMembers = () => {
    const { members } = this.props;
    const { filterText } = this.state;

    if (filterText) {
      const filterTextLower = filterText.toLowerCase().trim();

      return members.filter(({ name }) => name.toLowerCase().includes(filterTextLower));
    }

    return members;
  };

  filterChangeHandler = e => {
    this.setState({
      filterText: e.target.value,
    });
  };

  openMenuHandler = () => {
    // TODO: there will be openMenuHandler
  };

  inviteMemberHandler = () => {
    // TODO: there will be inviteLeaderHandler
  };

  writeMessageHandler = () => {
    // TODO: there will be writeMessageHandler
  };

  deleteMemberHandler = () => {
    // TODO: there will be deleteLeaderHandler
  };

  render() {
    const { filterText } = this.state;
    const members = this.getMembers();

    return (
      <Wrapper>
        <Header>
          <TabHeaderWrapper>
            <Title>Members</Title>
            <MembersCount>{members.length}</MembersCount>
          </TabHeaderWrapper>
          <InviteButton name="community-members__invite-member" onClick={this.inviteMemberHandler}>
            + Invite
          </InviteButton>
        </Header>
        <Search
          name="community-members__search-member-input"
          inverted
          label="Search member"
          type="search"
          placeholder="Search..."
          value={filterText}
          onChange={this.filterChangeHandler}
        />
        <MembersList>
          {members.map(({ name, username }) => (
            <MembersItem key={username}>
              <MemberAvatar userId={username} useLink />
              <Link route="profile" params={{ username }} passHref>
                <MemberLink>{name || username}</MemberLink>
              </Link>
              <MenuButton
                name="community-members__more-actions"
                aria-label="More actions"
                onClick={this.openMenuHandler}
              >
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
            </MembersItem>
          ))}
        </MembersList>
      </Wrapper>
    );
  }
}
