import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { getSubscribers } from 'store/actions/gate';
import { profileType } from 'types/common';
import { Card, /* Search, */ TabHeader } from '@commun/ui';
import InfinityScrollHelper from 'components/InfinityScrollHelper';
import UserRow from 'components/UserRow';

const Wrapper = styled(Card)`
  min-height: 100%;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  height: 55px;
`;

// const SearchStyled = styled(Search)`
//   margin-top: 20px;
// `;

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
    // filterText: '',
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

  // onFilterChange = e => {
  //   const { profile } = this.props;
  //
  //   const filterText = e.target.value;
  //   const filterTextLower = filterText.trim().toLowerCase();
  //
  //   this.setState({
  //     filterText,
  //     items: profile?.subscriptions?.communities.filter(
  //       community =>
  //         community.name.toLowerCase().startsWith(filterTextLower) ||
  //         community.id.startsWith(filterTextLower)
  //     ),
  //   });
  // };

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

    if (profile?.subscribers?.usersCount === 0) {
      return <EmptyList>No subscribes yet</EmptyList>;
    }

    if (items.length === 0) {
      return <EmptyList>Nothing is found</EmptyList>;
    }

    return (
      <InfinityScrollHelper disabled={isEnd || isLoading} onNeedLoadMore={this.onNeedLoadMore}>
        <Items>
          {items.map(userId => (
            <UserRow userId={userId} isOwner={isOwner} />
          ))}
        </Items>
      </InfinityScrollHelper>
    );
  }

  render() {
    const { profile } = this.props;
    // const { filterText  } = this.state;

    return (
      <Wrapper>
        <Header>
          <TabHeader title="Followers" quantity={profile?.subscribers?.usersCount} />
        </Header>
        {/* <SearchStyled */}
        {/*  name="profile-subscriptions__search-input" */}
        {/*  inverted */}
        {/*  label="Search" */}
        {/*  type="search" */}
        {/*  placeholder="Search..." */}
        {/*  value={filterText} */}
        {/*  onChange={this.onFilterChange} */}
        {/* /> */}
        {this.renderItems()}
      </Wrapper>
    );
  }
}
