/* eslint-disable no-alert */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Card, Search, TabHeader, styles } from '@commun/ui';
import { Icon } from '@commun/icons';
import { Link } from 'shared/routes';
import { profileType } from 'types/common';
import Avatar from 'components/Avatar';

const Wrapper = styled(Card)`
  min-height: 100%;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  height: 55px;
`;

const SearchStyled = styled(Search)`
  margin-top: 20px;
`;

const EmptyList = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 140px;
  font-size: 24px;
  font-weight: bold;
  color: #ddd;
  background: #fff;
`;

const Items = styled.ul`
  margin-top: 8px;
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  padding: 12px 0;
`;

const ItemText = styled.div`
  flex-grow: 1;
  margin-left: 16px;
`;

const ItemNameLink = styled.a`
  display: block;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.3px;
  ${styles.overflowEllipsis};
  color: #000;
`;

const ItemFollowers = styled.div`
  margin-top: 2px;
  font-size: 15px;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const Menu = styled.button.attrs({ type: 'button' })`
  display: flex;
  padding: 12px;
  margin: 0 -10px 0 16px;
  color: ${({ theme }) => theme.colors.contextGrey};
  cursor: pointer;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.hoverBlack};
  }
`;

const CancelIcon = styled(Icon)`
  width: 24px;
  height: 24px;
`;

const AvatarStyled = styled(Avatar)`
  width: 56px;
  height: 56px;
`;

export default class ProfileSubscriptions extends PureComponent {
  static propTypes = {
    profile: profileType.isRequired,
    isOwner: PropTypes.bool.isRequired,
    unpin: PropTypes.func.isRequired,
  };

  state = {
    filterText: '',
    // eslint-disable-next-line react/destructuring-assignment
    items: this.props.profile?.subscriptions?.communities || [],
  };

  onFilterChange = e => {
    const { profile } = this.props;

    const filterText = e.target.value;
    const filterTextLower = filterText.trim().toLowerCase();

    this.setState({
      filterText,
      items: profile?.subscriptions?.communities.filter(
        community =>
          community.name.toLowerCase().startsWith(filterTextLower) ||
          community.id.startsWith(filterTextLower)
      ),
    });
  };

  onUnsubscribeClick = async communityId => {
    const { unpin } = this.props;

    try {
      await unpin(communityId);
      // TODO: Update state
      window.alert('Success');
    } catch (err) {
      // TODO: Temp alert
      window.alert(err);
    }
  };

  renderItems() {
    const { isOwner, profile } = this.props;
    const { items } = this.state;

    if (profile?.subscriptions?.communities?.length === 0) {
      return <EmptyList>No subscribes yet</EmptyList>;
    }

    if (items.length === 0) {
      return <EmptyList>Nothing is found</EmptyList>;
    }

    return (
      <Items>
        {items.map(({ id, name }) => (
          <Item key={id}>
            <AvatarStyled communityName={id} useLink />
            <ItemText>
              <Link route="community" params={{ communityId: id }} passHref>
                <ItemNameLink>{name}</ItemNameLink>
              </Link>
              <ItemFollowers>{'{FOLLOWERS_COUNT}'} followers</ItemFollowers>
            </ItemText>
            {isOwner ? (
              <Menu
                name="profile-subscriptions__unsubscribe"
                title="Unsubscribe"
                onClick={() => this.onUnsubscribeClick(id)}
              >
                <CancelIcon name="cross" />
              </Menu>
            ) : null}
          </Item>
        ))}
      </Items>
    );
  }

  render() {
    const { filterText, items } = this.state;

    return (
      <Wrapper>
        <Header>
          <TabHeader title="Subscriptions" quantity={items.length} />
        </Header>
        <SearchStyled
          name="profile-subscriptions__search-input"
          inverted
          label="Search"
          type="search"
          placeholder="Search..."
          value={filterText}
          onChange={this.onFilterChange}
        />
        {this.renderItems()}
      </Wrapper>
    );
  }
}
