/* eslint-disable no-alert, no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, up } from '@commun/ui';

import { communityType } from 'types/common';
import { withTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';
import { multiArgsMemoize } from 'utils/common';
import { captureException } from 'utils/errors';
import { fetchUserCommunities } from 'store/actions/gate';

import CommunityRow from 'components/common/CommunityRow';
import EmptyList from 'components/common/EmptyList';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import { Items, SearchStyled, TopWrapper, Wrapper } from '../common';

const BigButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 38px;
  appearance: none;
`;

const CommunityRowStyled = styled(CommunityRow)`
  ${up.tablet} {
    &:not(:last-child) {
      margin-bottom: 20px;
    }
  }
`;

@withTranslation()
export default class UserCommunities extends PureComponent {
  static propTypes = {
    queryParams: PropTypes.shape({}).isRequired,
    items: PropTypes.arrayOf(communityType).isRequired,
    nextOffset: PropTypes.number.isRequired,
    isAllowLoadMore: PropTypes.bool.isRequired,
    isOwner: PropTypes.bool.isRequired,

    fetchUserCommunities: PropTypes.func.isRequired,
  };

  static async getInitialProps({ store, parentInitialProps }) {
    const queryParams = { userId: parentInitialProps.userId };

    await store.dispatch(fetchUserCommunities(queryParams));

    return {
      queryParams,
    };
  }

  state = {
    filterText: '',
  };

  filterItems = multiArgsMemoize((items, filter) =>
    items.filter(community => community.name.toLowerCase().startsWith(filter))
  );

  onFilterChange = text => {
    this.setState({
      filterText: text,
    });
  };

  checkLoadMore = () => {
    const { isAllowLoadMore, queryParams, fetchUserCommunities, nextOffset } = this.props;

    if (!isAllowLoadMore) {
      return;
    }

    try {
      fetchUserCommunities({
        ...queryParams,
        offset: nextOffset,
      });
    } catch (err) {
      captureException(err);
    }
  };

  renderEmpty() {
    const { isOwner, items, t } = this.props;

    if (items.length) {
      return <EmptyList noIcon />;
    }

    if (isOwner) {
      return (
        <EmptyList
          headerText={t('components.profile.user_communities.empty')}
          subText={t('components.profile.user_communities.empty-desc')}
        >
          <Link route="communities" passHref>
            <BigButton as="a">{t('components.profile.user_communities.find')}</BigButton>
          </Link>
        </EmptyList>
      );
    }

    return <EmptyList headerText={t('components.profile.user_communities.empty')} />;
  }

  renderItems() {
    const { items } = this.props;
    const { filterText } = this.state;

    let finalItems = items;

    if (filterText.trim()) {
      finalItems = this.filterItems(items, filterText.trim().toLowerCase());
    }

    return (
      <>
        <Items hasChildren={finalItems.length}>
          {finalItems.map(({ communityId }) => (
            <CommunityRowStyled communityId={communityId} key={communityId} />
          ))}
        </Items>
        {!finalItems.length ? this.renderEmpty() : null}
      </>
    );
  }

  render() {
    const { items, isAllowLoadMore, t } = this.props;
    const { filterText } = this.state;

    return (
      <Wrapper>
        {items.length ? (
          <TopWrapper>
            <SearchStyled
              name="profile-user-communities__search-input"
              inverted
              label={t('common.search')}
              type="search"
              placeholder={t('common.search_placeholder')}
              value={filterText}
              onChange={this.onFilterChange}
            />
          </TopWrapper>
        ) : null}
        <InfinityScrollHelper disabled={!isAllowLoadMore} onNeedLoadMore={this.checkLoadMore}>
          {this.renderItems()}
        </InfinityScrollHelper>
      </Wrapper>
    );
  }
}
