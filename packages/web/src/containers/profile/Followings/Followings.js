import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { getUserSubscriptions } from 'store/actions/gate';
import { userType } from 'types/common';
import { Card, PaginationLoader, Search, Button, up } from '@commun/ui';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import UserRow from 'components/common/UserRow';
import EmptyList from 'components/common/EmptyList';
import { multiArgsMemoize } from 'utils/common';

const Wrapper = styled(Card)`
  min-height: 240px;
  padding: 15px 15px 0;

  ${up.desktop} {
    padding-top: 20px;
  }
`;

const Items = styled.ul`
  margin-top: 20px;
`;

const BigButton = styled(Button)`
  height: 38px;
`;

export default class ProfileFollowers extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    isOwner: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(userType).isRequired,
    isEnd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    getUserSubscriptions: PropTypes.func.isRequired,
  };

  state = {
    filterText: '',
  };

  static async getInitialProps({ store, parentInitialProps }) {
    await store.dispatch(
      getUserSubscriptions({
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
    const { userId, items, isLoading, isEnd, getUserSubscriptions } = this.props;

    if (isLoading || isEnd) {
      return;
    }

    getUserSubscriptions({
      userId,
      offset: items.length,
    });
  };

  renderEmpty() {
    const { isOwner } = this.props;

    if (isOwner) {
      return (
        <EmptyList headerText="No Followings" subText="You have not any followings">
          <BigButton>Find new friends</BigButton>
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
        {isLoading ? <PaginationLoader /> : null}
        {!isLoading && finalItems.length === 0 ? this.renderEmpty() : null}
      </>
    );
  }

  render() {
    const { items } = this.props;
    const { filterText } = this.state;

    return (
      <Wrapper>
        {items.length ? (
          <Search
            name="profile-user-communities__search-input"
            inverted
            label="Search"
            type="search"
            placeholder="Search..."
            value={filterText}
            onChange={this.onFilterChange}
          />
        ) : null}
        {this.renderItems()}
      </Wrapper>
    );
  }
}
