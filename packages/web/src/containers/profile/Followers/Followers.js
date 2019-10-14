import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { getSubscribers } from 'store/actions/gate';
import { profileType } from 'types/common';
import { Card, Loader, Search } from '@commun/ui';
import InfinityScrollHelper from 'components/InfinityScrollHelper';
import UserRow from 'components/UserRow';

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
    sequenceKey: PropTypes.string,
    getSubscribers: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sequenceKey: null,
  };

  state = {
    filterText: '',
  };

  static getDerivedStateFromProps(props, state) {
    if (state.items !== props.items) {
      return { items: props.items };
    }
    return null;
  }

  static async getInitialProps({ store, query }) {
    const queryParams = { userId: query.userId };
    await store.dispatch(getSubscribers(queryParams));

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
    const { profile, isLoading, isEnd, sequenceKey, getSubscribers } = this.props;

    if (isLoading || isEnd) {
      return;
    }

    getSubscribers({ userId: profile.userId, sequenceKey });
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
          <EmptyList>No subscribes yet</EmptyList>
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
