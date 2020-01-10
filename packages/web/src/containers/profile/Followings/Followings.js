import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getUserSubscriptions } from 'store/actions/gate';
import { userType } from 'types/common';
import { PaginationLoader /* Button , */ } from '@commun/ui';
import { multiArgsMemoize } from 'utils/common';

import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import UserRow from 'components/common/UserRow';
import EmptyList from 'components/common/EmptyList';
import { Wrapper, Items, TopWrapper, SearchStyled } from '../common';

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
        <EmptyList headerText="No Following" subText="You have not any following">
          {/* TODO: should be implemented later */}
          {/* <BigButton primary>Find new friends</BigButton> */}
        </EmptyList>
      );
    }

    return <EmptyList headerText="No Following" />;
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
          <TopWrapper>
            <SearchStyled
              name="profile-user-communities__search-input"
              inverted
              label="Search"
              type="search"
              placeholder="Search..."
              value={filterText}
              onChange={this.onFilterChange}
            />
          </TopWrapper>
        ) : null}
        {this.renderItems()}
      </Wrapper>
    );
  }
}
