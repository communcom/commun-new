import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'shared/routes';

import { InvisibleText, Search } from '@commun/ui';

import { RIGHT_SIDE_BAR_WIDTH } from 'shared/constants';
import Avatar from 'components/Avatar';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  width: ${RIGHT_SIDE_BAR_WIDTH}px;
  padding: 8px 16px 24px;
  background-color: #fff;
  border: 1px solid ${({ theme }) => theme.colors.contextLightGrey};
  border-radius: 4px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
`;

const Title = styled.h4`
  font-size: 12px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const MembersLink = styled.a`
  padding-left: 20px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.communityColor};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.communityColorHover};
  }
`;

const MembersList = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 80px;
`;

const MembersItem = styled.li``;

const AddMemberHeader = styled(Header)`
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

export default class MembersWidget extends PureComponent {
  static propTypes = {
    members: PropTypes.arrayOf(
      PropTypes.shape({
        username: PropTypes.string.isRequired,
        name: PropTypes.string,
      })
    ).isRequired,
    communityId: PropTypes.string.isRequired,
  };

  state = {
    inputValue: '',
  };

  getMembersCount = members => (members.length > 1 ? `${members.length} members` : `1 member`);

  changeSearchHandler = e => {
    this.setState({
      inputValue: e.target.value,
    });
  };

  render() {
    const { members, communityId } = this.props;
    const { inputValue } = this.state;

    return (
      <Wrapper>
        <Header>
          <Title>Members</Title>
          <Link route="communitySection" params={{ communityId, section: 'members' }} passHref>
            <MembersLink>{this.getMembersCount(members)}</MembersLink>
          </Link>
        </Header>
        <MembersList>
          {members.slice(0, 5).map(({ username, name }) => (
            <MembersItem key={username}>
              <Avatar userId={username} useLink />
              <InvisibleText>{name || username}</InvisibleText>
            </MembersItem>
          ))}
        </MembersList>
        <AddMemberHeader as="label" htmlFor="members-widget-search">
          Add member
        </AddMemberHeader>
        <Search
          id="members-widget__search-input"
          inverted
          label="Search"
          type="search"
          placeholder="Search..."
          value={inputValue}
          onChange={this.changeSearchHandler}
        />
      </Wrapper>
    );
  }
}
