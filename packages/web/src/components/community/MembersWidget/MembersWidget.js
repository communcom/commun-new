/* eslint-disable class-methods-use-this,no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { InvisibleText, Search } from '@commun/ui';

import { communityType } from 'types';
import Avatar from 'components/common/Avatar';
import { CommunityLink } from 'components/links';
import SeeAll from 'components/common/SeeAll';
import Widget, { Header, Title } from 'components/common/Widget';
import { getCommunityMembersWidget } from 'store/actions/gate';

const ITEMS_LIMIT = 5;

const MembersList = styled.ul`
  display: flex;
  align-items: center;
  min-height: 60px;
  padding: 0 16px;
  overflow: hidden;
`;

const MembersItem = styled.li`
  &:not(:last-child) {
    margin-right: 12px;
  }
`;

const AvatarStyled = styled(Avatar)`
  display: block;
`;

const AddMemberHeader = styled(Header)`
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const SearchWrapper = styled.div`
  padding: 0 16px 16px;
`;

export default class MembersWidget extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    community: communityType.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        username: PropTypes.string.isRequired,
        name: PropTypes.string,
      })
    ).isRequired,
    isLoaded: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    getCommunityMembersWidget: PropTypes.func.isRequired,
  };

  static async getInitialProps({ store, parentInitialProps }) {
    const { communityId } = parentInitialProps;

    try {
      await store.dispatch(getCommunityMembersWidget({ communityId, limit: ITEMS_LIMIT }));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('getCommunityMembers failed:', err);
    }
  }

  state = {
    inputValue: '',
  };

  componentDidMount() {
    const { communityId, isLoaded, isLoading, getCommunityMembersWidget } = this.props;

    if (!isLoaded && !isLoading) {
      getCommunityMembersWidget({
        communityId,
        limit: ITEMS_LIMIT,
      });
    }
  }

  getMembersCount({ length }) {
    if (length === 0) {
      return 'No members';
    }

    if (length === 1) {
      return '1 member';
    }

    return `${length} members`;
  }

  changeSearchHandler = e => {
    this.setState({
      inputValue: e.target.value,
    });
  };

  render() {
    const { items, community } = this.props;
    const { inputValue } = this.state;

    return (
      <Widget>
        <Header>
          <Title>{this.getMembersCount(items)}</Title>
          <CommunityLink community={community} section="members">
            <SeeAll />
          </CommunityLink>
        </Header>
        <MembersList>
          {items.map(({ userId, username }) => (
            <MembersItem key={userId}>
              <AvatarStyled userId={userId} useLink />
              <InvisibleText>{username}</InvisibleText>
            </MembersItem>
          ))}
        </MembersList>
        <AddMemberHeader as="label" htmlFor="members-widget-search">
          Add member
        </AddMemberHeader>
        <SearchWrapper>
          <Search
            id="members-widget__search-input"
            inverted
            label="Search"
            type="search"
            placeholder="Search..."
            value={inputValue}
            onChange={this.changeSearchHandler}
          />
        </SearchWrapper>
      </Widget>
    );
  }
}
