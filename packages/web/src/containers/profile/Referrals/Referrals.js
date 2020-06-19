import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { PaginationLoader } from '@commun/ui';

import { userType } from 'types/common';
import { withTranslation } from 'shared/i18n';
import { multiArgsMemoize } from 'utils/common';
import { getUserReferrals } from 'store/actions/gate';

import EmptyList from 'components/common/EmptyList';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import UserRow from 'components/common/UserRow';
import ReferralsInviteWidget from 'components/widgets/ReferralsInviteWidget';
import { Items, SearchStyled, TopWrapper, Wrapper } from '../common';

@withTranslation()
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
    const { t } = this.props;

    return (
      <EmptyList
        headerText={
          isFiltered
            ? t('components.profile.referrals.no_found')
            : t('components.profile.referrals.empty')
        }
        subText={isFiltered ? null : t('components.profile.referrals.empty-desc')}
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
    const { items, t } = this.props;
    const { filterText } = this.state;

    return (
      <>
        <ReferralsInviteWidget />
        <Wrapper>
          {items.length ? (
            <TopWrapper>
              <SearchStyled
                name="profile-user-referrals__search-input"
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
      </>
    );
  }
}
