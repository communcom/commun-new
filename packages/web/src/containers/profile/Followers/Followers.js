import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { getSubscribers } from 'store/actions/gate';
import { profileType } from 'types/common';
import { Card, Loader, Search } from '@commun/ui';
import InfinityScrollHelper from 'components/InfinityScrollHelper';
import UserRow from 'components/UserRow';
import EmptyList from '../EmptyList';

const Wrapper = styled(Card)`
  min-height: 100%;
  height: 356px;
  width: 502px;
`;

const SearchStyled = styled(Search)`
  margin-top: 20px;
`;

const Items = styled.ul`
  margin-top: 8px;
`;
const Buttons = styled.div`
  width: 294px;
  margin-top: 20px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Button = styled.button.attrs({ type: 'button' })`
  width: 142px;
  height: 38px;
  background: #6a80f5;
  border-radius: 48px;

  color: #fff;
  font-weight: bold;
  font-size: 12px;
  line-height: 100%;

  text-align: center;
`;

const FindNewFriendsButton = styled(Button)``;

const CreateNewPostButton = styled(Button)``;

const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  animation: fade-in 0.25s forwards;
  animation-delay: 0.25s;
`;

const LoaderStyled = styled(Loader)`
  svg {
    width: 40px;
    height: 40px;
    color: ${({ theme }) => theme.colors.contextBlue};
  }
`;

export default class ProfileFollowers extends Component {
  static propTypes = {
    // connect
    profile: profileType.isRequired,
    isOwner: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    isEnd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    getSubscribers: PropTypes.func.isRequired,
  };

  state = {
    filterText: '',
    offset: 0,
    limit: 20,
  };

  static getDerivedStateFromProps(props, state) {
    if (state.items !== props.items) {
      return { items: props.items };
    }
    return null;
  }

  static async getInitialProps({ store, query }) {
    const params = { userId: query.userId };
    await store.dispatch(getSubscribers(params));

    return {
      namespacesRequired: [],
    };
  }

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

  onNeedLoadMore = () => {
    // eslint-disable-next-line no-shadow
    const { profile, isLoading, isEnd, getSubscribers } = this.props;
    const { offset, limit } = this.state;

    if (isLoading || isEnd) {
      return;
    }

    getSubscribers({ userId: profile.userId, offset, limit });
    this.increaseOffset();
  };

  increaseOffset = () => {
    const { offset, limit } = this.state;
    this.setState({
      offset: offset + limit,
    });
  };

  renderItems() {
    const { isOwner, profile, isEnd, isLoading } = this.props;
    const { items } = this.state;

    return (
      <>
        <InfinityScrollHelper disabled={isEnd || isLoading} onNeedLoadMore={this.onNeedLoadMore}>
          <Items>
            {items.map(userId => (
              <UserRow userId={userId} isOwner={isOwner} />
            ))}
          </Items>
        </InfinityScrollHelper>
        {!isLoading && !profile?.subscribers?.usersCount ? (
          <EmptyList headerText="No Followers" subText="You have not any followers">
            <Buttons>
              <FindNewFriendsButton>Find new friends</FindNewFriendsButton>
              <CreateNewPostButton>Create new post</CreateNewPostButton>
            </Buttons>
          </EmptyList>
        ) : null}
        {isLoading ? (
          <LoaderWrapper>
            <LoaderStyled />
          </LoaderWrapper>
        ) : null}
      </>
    );
  }

  render() {
    const { filterText } = this.state;

    return (
      <Wrapper>
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
