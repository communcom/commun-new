import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { communityType } from 'types';
import { fetchLeaderCommunities } from 'store/actions/gate';

import EmptyList from 'components/common/EmptyList/EmptyList';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import { Wrapper, Items, CommunityRowStyled, BigButton } from '../common.styled';

export default class Manage extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(communityType).isRequired,
    isOwner: PropTypes.bool.isRequired,
    isAllowLoadMore: PropTypes.bool.isRequired,

    fetchLeaderCommunities: PropTypes.func.isRequired,
  };

  static async getInitialProps({ store }) {
    await store.dispatch(fetchLeaderCommunities());

    return {
      namespacesRequired: [],
    };
  }

  checkLoadMore = async () => {
    // eslint-disable-next-line no-shadow
    const { items, isAllowLoadMore, fetchLeaderCommunities } = this.props;

    if (!isAllowLoadMore) {
      return;
    }

    await fetchLeaderCommunities({
      offset: items.length,
    });
  };

  renderEmpty() {
    const { isOwner, items } = this.props;

    if (items.length) {
      return <EmptyList headerText="Nothing is found" noIcon />;
    }

    if (isOwner) {
      return (
        <EmptyList headerText="No Subscriptions" subText="You do not manage any communities">
          <BigButton>Find communities</BigButton>
        </EmptyList>
      );
    }

    return <EmptyList headerText="No managed communities" />;
  }

  renderItems() {
    const { items, isAllowLoadMore } = this.props;

    return (
      <InfinityScrollHelper disabled={!isAllowLoadMore} onNeedLoadMore={this.checkLoadMore}>
        <Items>
          {items.map(({ communityId }) => (
            <CommunityRowStyled communityId={communityId} key={communityId} />
          ))}
        </Items>
        {!items.length ? this.renderEmpty() : null}
      </InfinityScrollHelper>
    );
  }

  render() {
    return <Wrapper>{this.renderItems()}</Wrapper>;
  }
}
