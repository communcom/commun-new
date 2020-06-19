import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { PaginationLoader /* Button , */ } from '@commun/ui';

import { userType } from 'types/common';
import { withTranslation } from 'shared/i18n';
import { multiArgsMemoize } from 'utils/common';
import { getUserSubscriptions } from 'store/actions/gate';

import EmptyList from 'components/common/EmptyList';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import UserRow from 'components/common/UserRow';
import { Items, SearchStyled, TopWrapper, Wrapper } from '../common';

// const BigButton = styled(Button)`
//   height: 38px;
// `;

@withTranslation()
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

  onFilterChange = text => {
    this.setState({
      filterText: text,
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
    const { isOwner, t } = this.props;

    if (isOwner) {
      return (
        <EmptyList
          headerText={t('components.profile.following.empty')}
          subText={t('components.profile.following.empty-desc')}
        >
          {/* TODO: should be implemented later */}
          {/* <BigButton primary>Find new friends</BigButton> */}
        </EmptyList>
      );
    }

    return <EmptyList headerText={t('components.profile.following.empty')} />;
  }

  renderItems() {
    const { isEnd, isLoading, items } = this.props;
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
              <UserRow key={userId} userId={userId} />
            ))}
          </Items>
        </InfinityScrollHelper>
        {isLoading ? <PaginationLoader /> : null}
        {!isLoading && finalItems.length === 0 ? this.renderEmpty() : null}
      </>
    );
  }

  render() {
    const { items, t } = this.props;
    const { filterText } = this.state;

    return (
      <Wrapper>
        {items.length ? (
          <TopWrapper>
            <SearchStyled
              name="profile-user-followings__search-input"
              inverted
              label={t('common.search')}
              type="search"
              placeholder={t('common.search_placeholder')}
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
