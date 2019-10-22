/* eslint-disable no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Search, TextButton, PaginationLoader, styles, up } from '@commun/ui';
import { userType } from 'types';
import { multiArgsMemoize } from 'utils/common';
import { displayError } from 'utils/toastsMessages';
import { fetchCommunityMembers } from 'store/actions/gate';
import Avatar from 'components/common/Avatar';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import { ProfileLink } from 'components/links';

import {
  Wrapper,
  Header,
  Title,
  TabHeaderWrapper,
  MenuButton,
  IconStyled,
  ActionsPanel,
  ActionsItem,
  ActionButton,
  ButtonsBar,
} from '../common';

const MembersCount = styled.span`
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

const MembersList = styled.ul`
  margin-top: 8px;
`;

const MembersItem = styled.li`
  display: flex;
  align-items: center;
  min-height: 64px;

  ${up.tablet} {
    min-height: 80px;
  }
`;

const MemberAvatar = styled(Avatar)`
  ${up.tablet} {
    width: 56px;
    height: 56px;
  }
`;

const MemberLink = styled.a`
  display: block;
  height: 100%;
  margin-top: -6px;
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

  ${up.tablet} {
    font-size: 17px;
  }
`;

export default class Members extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isEnd: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(userType).isRequired,
    fetchCommunityMembersWidget: PropTypes.func.isRequired,
  };

  static async getInitialProps({ store, parentInitialProps }) {
    await store.dispatch(
      fetchCommunityMembers({
        communityId: parentInitialProps.communityId,
      })
    );
  }

  state = {
    filterText: '',
  };

  getActions = () => [
    {
      action: 'Message to member',
      icon: 'chat',
      handler: () => {},
    },
    {
      action: 'Delete member',
      icon: 'delete',
      handler: () => {},
    },
  ];

  getMembers = multiArgsMemoize((items, filterText) => {
    if (filterText) {
      const filterTextLower = filterText.toLowerCase().trim();
      return items.filter(({ username }) => username.startsWith(filterTextLower));
    }

    return items;
  });

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

  onNeedLoadMore = async () => {
    const { communityId, isLoading, isEnd, items, fetchCommunityMembersWidget } = this.props;

    if (isLoading || isEnd) {
      return;
    }

    try {
      await fetchCommunityMembersWidget({
        communityId,
        offset: items.length,
      });
    } catch (err) {
      displayError(err);
    }
  };

  renderActions() {
    return (
      <>
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
              <ActionButton title={action} onClick={handler}>
                <IconStyled name={icon} />
              </ActionButton>
            </ActionsItem>
          ))}
        </ActionsPanel>
      </>
    );
  }

  renderItem = user => (
    <MembersItem key={user.userId}>
      <MemberAvatar userId={user.userId} useLink />
      <ProfileLink user={user}>
        <MemberLink>{user.username}</MemberLink>
      </ProfileLink>
      {/* {this.renderActions()} */}
    </MembersItem>
  );

  render() {
    const { items, isLoading } = this.props;
    const { filterText } = this.state;

    const finalItems = this.getMembers(items, filterText);

    return (
      <Wrapper>
        <Header>
          <TabHeaderWrapper>
            <Title>Members</Title>
            <MembersCount>{finalItems.length}</MembersCount>
          </TabHeaderWrapper>
          <ButtonsBar>
            <TextButton name="community-members__invite-member" onClick={this.inviteMemberHandler}>
              + Invite
            </TextButton>
          </ButtonsBar>
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
          <InfinityScrollHelper onNeedLoadMore={this.onNeedLoadMore}>
            {finalItems.map(this.renderItem)}
          </InfinityScrollHelper>
        </MembersList>
        {isLoading ? <PaginationLoader /> : null}
      </Wrapper>
    );
  }
}
