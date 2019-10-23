/* eslint-disable no-alert */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Card, Search, Button, up } from '@commun/ui';

import { Link } from 'shared/routes';
import { communityType } from 'types/common';
import { multiArgsMemoize } from 'utils/common';

import EmptyList from 'components/common/EmptyList';
import {
  Item,
  ItemText,
  ItemNameLink,
  StatsWrapper,
  StatsItem,
  AvatarStyled,
} from 'components/common/UserRow/UserRow.styled';

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

export default class UserCommunities extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(communityType).isRequired,
    isOwner: PropTypes.bool.isRequired,
  };

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
        <Items>
          {finalItems.map(({ communityId, alias, name, subscribersCount }) => (
            <Item key={communityId}>
              <AvatarStyled communityId={communityId} useLink />
              <ItemText>
                <Link route="community" params={{ communityAlias: alias }} passHref>
                  <ItemNameLink>{name}</ItemNameLink>
                </Link>
                <StatsWrapper>
                  {/* TODO: should be replaced with real data when backend will be ready */}
                  <StatsItem>{`${subscribersCount} followers`}</StatsItem>
                  <StatsItem isSeparator>{` \u2022 `}</StatsItem>
                  <StatsItem>31 posts</StatsItem>
                </StatsWrapper>
              </ItemText>
            </Item>
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
