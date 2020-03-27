/* eslint-disable no-alert */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'shared/routes';

import { Button } from '@commun/ui';

import { communityType } from 'types/common';
import { multiArgsMemoize } from 'utils/common';
import { withTranslation } from 'shared/i18n';
import { fetchUserCommunities } from 'store/actions/gate';

import EmptyList from 'components/common/EmptyList';
import CommunityRow from 'components/common/CommunityRow';
import { Wrapper, Items, TopWrapper, SearchStyled } from '../common';

const BigButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 38px;
  appearance: none;
`;

@withTranslation()
export default class UserCommunities extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  static propTypes = {
    items: PropTypes.arrayOf(communityType).isRequired,
    isOwner: PropTypes.bool.isRequired,
  };

  static async getInitialProps({ store, parentInitialProps }) {
    await store.dispatch(
      fetchUserCommunities({
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
    items.filter(community => community.name.toLowerCase().startsWith(filter))
  );

  onFilterChange = text => {
    this.setState({
      filterText: text,
    });
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
            <CommunityRow communityId={communityId} key={communityId} />
          ))}
        </Items>
        {!finalItems.length ? this.renderEmpty() : null}
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
        {this.renderItems()}
      </Wrapper>
    );
  }
}
