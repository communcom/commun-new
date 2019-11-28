/* eslint-disable no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Card, PaginationLoader, Search, InvisibleText } from '@commun/ui';
import { Icon } from '@commun/icons';
import { userType } from 'types';
import { multiArgsMemoize } from 'utils/common';
import { displayError } from 'utils/toastsMessages';
import { fetchCommunityMembers } from 'store/actions/gate';

import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import UserRow from 'components/common/UserRow';
import EmptyList from 'components/common/EmptyList';

const Wrapper = styled(Card)`
  padding: 20px 15px 0;
  margin-bottom: 8px;
`;

const Items = styled.ul`
  padding-top: 20px;
`;

const InviteButton = styled.button.attrs({ type: 'button' })`
  position: relative;
  width: 34px;
  height: 34px;
  padding: 7px;
  border-radius: 50px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  font-size: 20px;
  line-height: 100%;
  text-align: center;
  transition: background-color 0.15s;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.blue};
  }
`;

const EmojiWrapper = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  line-height: 100%;
`;

const PlusIconWrapper = styled.div`
  position: absolute;
  right: -2px;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 14px;
  height: 14px;
  line-height: 1;
  background-color: ${({ theme }) => theme.colors.blue};
  color: #fff;
  border: 1px solid #fff;
  border-radius: 50%;
`;

const PlusIcon = styled(Icon).attrs({ name: 'cross' })`
  width: 6px;
  height: 6px;
  transform: rotate(45deg);
`;

const TopWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  & > :not(:last-child) {
    margin-right: 9px;
  }
`;

const SearchStyled = styled(Search)`
  flex-grow: 1;

  & input {
    &,
    &::placeholder {
      font-size: 15px;
      line-height: 20px;
    }
  }
`;

export default class Members extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isEnd: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(userType).isRequired,

    fetchCommunityMembers: PropTypes.func.isRequired,
  };

  static async getInitialProps({ store, parentInitialProps }) {
    await store.dispatch(
      fetchCommunityMembers({
        communityId: parentInitialProps.communityId,
      })
    );
  }

  state = {
    filterText: '',
  };

  filterItems = multiArgsMemoize((items, filterText) => {
    if (filterText) {
      const filterTextLower = filterText.toLowerCase().trim();
      return items.filter(({ username }) => username.toLowerCase().startsWith(filterTextLower));
    }

    return items;
  });

  onFilterChange = e => {
    this.setState({
      filterText: e.target.value,
    });
  };

  onInviteMember = () => {
    // TODO: there will be inviteLeaderHandler
    // eslint-disable-next-line no-alert
    window.alert('Not implemented yet');
  };

  onNeedLoadMore = async () => {
    const { communityId, isLoading, isEnd, items, fetchCommunityMembers } = this.props;

    if (isLoading || isEnd) {
      return;
    }

    try {
      await fetchCommunityMembers({
        communityId,
        offset: items.length,
      });
    } catch (err) {
      displayError(err);
    }
  };

  renderEmpty() {
    const { items } = this.props;

    if (items.length) {
      return <EmptyList headerText="Nothing is found" noIcon />;
    }

    return <EmptyList headerText="No subscribers" />;
  }

  renderItems() {
    const { items, isEnd, isLoading } = this.props;
    const { filterText } = this.state;

    let finalItems = items;

    if (filterText.trim()) {
      finalItems = this.filterItems(items, filterText.trim().toLowerCase());
    }

    return (
      <>
        <InfinityScrollHelper disabled={isEnd || isLoading} onNeedLoadMore={this.onNeedLoadMore}>
          <Items>
            {finalItems.map(({ userId }) => (
              <UserRow userId={userId} key={userId} />
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
          <TopWrapper>
            <SearchStyled
              name="community-members__search-member-input"
              inverted
              label="Search"
              type="search"
              placeholder="Search..."
              value={filterText}
              onChange={this.onFilterChange}
            />
            <InviteButton onClick={this.onInviteMember}>
              {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
              <EmojiWrapper role="img" aria-label="Invite member">
                🤴🏻
              </EmojiWrapper>
              <PlusIconWrapper>
                <PlusIcon />
              </PlusIconWrapper>
              <InvisibleText>Invite member</InvisibleText>
            </InviteButton>
          </TopWrapper>
        ) : null}
        {this.renderItems()}
      </Wrapper>
    );
  }
}
