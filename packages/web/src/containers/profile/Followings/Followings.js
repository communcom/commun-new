import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { getUserSubscriptions } from 'store/actions/gate';
import { userType } from 'types/common';
import { Card, PaginationLoader, Search, /* Button , */ up } from '@commun/ui';
import { multiArgsMemoize } from 'utils/common';

import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import UserRow from 'components/common/UserRow';
import EmptyList from 'components/common/EmptyList';

const Wrapper = styled(Card)`
  padding: 15px 15px 0;
  margin-bottom: 8px;

  ${up.desktop} {
    padding-top: 20px;
  }
`;

const Items = styled.ul`
  ${is('hasChildren')`
    padding-top: 20px;
 `}
`;

// const BigButton = styled(Button)`
//   height: 38px;
// `;

export default class ProfileFollowings extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    isOwner: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(userType).isRequired,
    isEnd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    getUserSubscriptions: PropTypes.func.isRequired,
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

  state = {
    filterText: '',
  };

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
          {/* TODO: should be implemented later */}
          {/* <BigButton primary>Find new friends</BigButton> */}
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
          <Items hasChildren={finalItems.length}>
            {finalItems.map(({ userId }) => (
              <UserRow userId={userId} isOwner={isOwner} key={userId} />
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
