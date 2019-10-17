import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { getUserCommunities } from 'store/actions/gate';
import { userType } from 'types/common';
import { Card, Loader, Search, Button } from '@commun/ui';
import InfinityScrollHelper from 'components/InfinityScrollHelper';
import UserRow from 'components/UserRow';
import EmptyList from 'components/EmptyList';
import { multiArgsMemoize } from 'utils/common';

const Wrapper = styled(Card)`
  min-height: 100%;
`;

const Items = styled.ul`
  margin-top: 8px;
`;

const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  animation: fade-in 0.25s forwards;
  animation-delay: 0.25s;
`;

const LoaderStyled = styled(Loader)`
  svg {
    width: 40px;
    height: 40px;
    color: ${({ theme }) => theme.colors.contextBlue};
  }
`;

export default class ProfileFollowers extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    isOwner: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(userType).isRequired,
    isEnd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    getUserCommunities: PropTypes.func.isRequired,
  };

  state = {
    filterText: '',
  };

  static async getInitialProps({ store, parentInitialProps }) {
    await store.dispatch(
      getUserCommunities({
        userId: parentInitialProps.userId,
      })
    );

    return {
      namespacesRequired: [],
    };
  }

  filterItems = multiArgsMemoize((items, filter) =>
    items.filter(user => user.username.startsWith(filter))
  );

  onFilterChange = e => {
    this.setState({
      filterText: e.target.value,
    });
  };

  onNeedLoadMore = () => {
    // eslint-disable-next-line no-shadow
    const { userId, items, isLoading, isEnd, getUserCommunities } = this.props;

    if (isLoading || isEnd) {
      return;
    }

    getUserCommunities({
      userId,
      offset: items.length,
    });
  };

  renderEmpty() {
    const { isOwner } = this.props;

    if (isOwner) {
      return (
        <EmptyList headerText="No Followings" subText="You have not any followings">
          <Button>Find new friends</Button>
        </EmptyList>
      );
    }

    return <EmptyList headerText="No Followings" />;
  }

  renderItems() {
    const { isOwner, isEnd, isLoading, items } = this.props;
    const { filterText } = this.state;

    let finalItems = items;

    if (filterText.trim()) {
      finalItems = this.filterItems(items, filterText.trim().toLowerCase());
    }

    return (
      <>
        <InfinityScrollHelper disabled={isEnd || isLoading} onNeedLoadMore={this.onNeedLoadMore}>
          <Items>
            {finalItems.map(({ userId }) => (
              <UserRow userId={userId} isOwner={isOwner} />
            ))}
          </Items>
        </InfinityScrollHelper>
        {isLoading ? (
          <LoaderWrapper>
            <LoaderStyled />
          </LoaderWrapper>
        ) : null}
        {!isLoading && finalItems.length === 0 ? this.renderEmpty() : null}
      </>
    );
  }

  render() {
    const { filterText } = this.state;

    return (
      <Wrapper>
        <Search
          name="profile-user-communities__search-input"
          inverted
          label="Search"
          type="search"
          placeholder="Search..."
          value={filterText}
          onChange={this.onFilterChange}
        />
        {this.renderItems()}
      </Wrapper>
    );
  }
}
