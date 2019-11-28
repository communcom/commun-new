import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { getUserSubscribers } from 'store/actions/gate';
import { userType } from 'types/common';
import { multiArgsMemoize } from 'utils/common';
import { Card, PaginationLoader, Search, Button, up } from '@commun/ui';

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

const BigButton = styled(Button)`
  height: 38px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

export default class ProfileFollowers extends Component {
  // eslint-disable-next-line react/sort-comp
  static propTypes = {
    userId: PropTypes.string.isRequired,
    isOwner: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(userType).isRequired,
    isEnd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    getUserSubscribers: PropTypes.func.isRequired,

    openModalEditor: PropTypes.func.isRequired,
  };

  static async getInitialProps({ store, parentInitialProps }) {
    await store.dispatch(
      getUserSubscribers({
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

  onNewPostClick = () => {
    const { openModalEditor } = this.props;
    openModalEditor();
  };

  onNeedLoadMore = () => {
    // eslint-disable-next-line no-shadow
    const { userId, isLoading, isEnd, items, getUserSubscribers } = this.props;

    if (isLoading || isEnd) {
      return;
    }

    getUserSubscribers({
      userId,
      offset: items.length,
    });
  };

  renderEmpty() {
    const { isOwner, items } = this.props;

    if (items.length) {
      return <EmptyList headerText="Nothing is found" noIcon />;
    }

    if (isOwner) {
      return (
        <EmptyList
          headerText="No Followers"
          subText="You have not any followings. You can find new friends or create new post."
        >
          <ButtonsWrapper>
            {/* TODO: should be implemented later */}
            {/* <BigButton primary>Find new friends</BigButton> */}
            <BigButton primary onClick={this.onNewPostClick}>
              Create new post
            </BigButton>
          </ButtonsWrapper>
        </EmptyList>
      );
    }

    return <EmptyList headerText="No followers" />;
  }

  renderItems() {
    const { items, isOwner, isEnd, isLoading } = this.props;
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
            name="profile-subscriptions__search-input"
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
