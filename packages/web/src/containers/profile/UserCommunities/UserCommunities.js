/* eslint-disable no-alert */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button } from '@commun/ui';

import { communityType } from 'types/common';
import { multiArgsMemoize } from 'utils/common';
import { fetchUserCommunities } from 'store/actions/gate';

import EmptyList from 'components/common/EmptyList';
import CommunityRow from 'components/common/CommunityRow';
import { Wrapper, Items, TopWrapper, SearchStyled } from '../common';

const BigButton = styled(Button)`
  height: 38px;
`;

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

  onFilterChange = e => {
    this.setState({
      filterText: e.target.value,
    });
  };

  renderEmpty() {
    const { isOwner, items } = this.props;

    if (items.length) {
      return <EmptyList headerText="Nothing is found" noIcon />;
    }

    if (isOwner) {
      return (
        <EmptyList headerText="No Subscriptions" subText="You have not subscribed to any community">
          <BigButton>Find communities</BigButton>
        </EmptyList>
      );
    }

    return <EmptyList headerText="No Subscriptions" />;
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
