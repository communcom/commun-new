/* eslint-disable no-alert */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Card, Search, styles } from '@commun/ui';
import { Icon } from '@commun/icons';
import { Link } from 'shared/routes';
import { profileType } from 'types/common';
import Avatar from 'components/common/Avatar';

const Wrapper = styled(Card)`
  min-height: 100%;
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

export default class UserCommunities extends PureComponent {
  static propTypes = {
    profile: profileType.isRequired,
    isOwner: PropTypes.bool.isRequired,
    unpin: PropTypes.func.isRequired,
  };

  state = {
    filterText: '',
    // eslint-disable-next-line react/destructuring-assignment
    items: this.props.profile?.commonCommunities || [],
  };

  onFilterChange = e => {
    const { profile } = this.props;

    const filterText = e.target.value;
    const filterTextLower = filterText.trim().toLowerCase();

    this.setState({
      filterText,
      items: profile?.commonCommunities.filter(
        community =>
          community.name.toLowerCase().startsWith(filterTextLower) ||
          community.communityId.startsWith(filterTextLower)
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

    if (profile?.commonCommunities.length === 0) {
      return <EmptyList>No subscribes yet</EmptyList>;
    }

    if (items.length === 0) {
      return <EmptyList>Nothing is found</EmptyList>;
    }

    return (
      <Items>
        {items.map(({ communityId, alias, name }) => (
          <Item key={communityId}>
            <AvatarStyled communityName={communityId} useLink />
            <ItemText>
              <Link route="community" params={{ communityAlias: alias }} passHref>
                <ItemNameLink>{name}</ItemNameLink>
              </Link>
              <ItemFollowers>{'{FOLLOWERS_COUNT}'} followers</ItemFollowers>
            </ItemText>
            {isOwner ? (
              <Menu
                name="profile-user-communities__unsubscribe"
                title="Unsubscribe"
                onClick={() => this.onUnsubscribeClick(communityId)}
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
    const { filterText } = this.state;

    return (
      <Wrapper>
        <SearchStyled
          name="profile-user-communities__search-input"
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
