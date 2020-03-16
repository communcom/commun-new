import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getUserReferrals } from 'store/actions/gate';
import { userType } from 'types/common';
import { PaginationLoader } from '@commun/ui';
import { multiArgsMemoize } from 'utils/common';

import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import UserRow from 'components/common/UserRow';
import EmptyList from 'components/common/EmptyList';
import { Wrapper, Items, TopWrapper, SearchStyled } from '../common';

export default class ProfileReferrals extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(userType).isRequired,
    isEnd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    getUserReferrals: PropTypes.func.isRequired,
  };

  static async getInitialProps({ store }) {
    await store.dispatch(getUserReferrals());

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

  onFilterChange = text => {
    this.setState({
      filterText: text,
    });
  };

  onNeedLoadMore = () => {
    // eslint-disable-next-line no-shadow
    const { items, isLoading, isEnd, getUserReferrals } = this.props;

    if (isLoading || isEnd) {
      return;
    }

    getUserReferrals({
      offset: items.length,
    });
  };

  // eslint-disable-next-line class-methods-use-this
  renderEmpty(isFiltered) {
    return (
      <EmptyList
        headerText={isFiltered ? 'Nothing is found' : 'No Referrals'}
        subText={isFiltered ? null : "You don't have any referral users"}
      />
    );
  }

  renderItems() {
    const { isEnd, isLoading, items } = this.props;
    const { filterText } = this.state;

    const filterTextTrimmed = filterText.trim();
    const isFiltered = Boolean(filterTextTrimmed);
    let finalItems = items;

    if (isFiltered) {
      finalItems = this.filterItems(items, filterTextTrimmed.toLowerCase());
    }

    return (
      <>
        <InfinityScrollHelper disabled={isEnd || isLoading} onNeedLoadMore={this.onNeedLoadMore}>
          <Items hasChildren={finalItems.length}>
            {finalItems.map(({ userId }) => (
              <UserRow key={userId} userId={userId} />
            ))}
          </Items>
        </InfinityScrollHelper>
        {isLoading ? <PaginationLoader /> : null}
        {!isLoading && finalItems.length === 0 ? this.renderEmpty(isFiltered) : null}
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
              name="profile-user-referrals__search-input"
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
