import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'shared/routes';

import { communityType } from 'types';
import { fetchMyCommunities } from 'store/actions/gate';

import EmptyList from 'components/common/EmptyList/EmptyList';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import { Wrapper, Items, CommunityRowStyled, BigButton } from '../common.styled';

export default class MyCommunities extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(communityType).isRequired,
    isAllowLoadMore: PropTypes.bool.isRequired,

    fetchMyCommunities: PropTypes.func.isRequired,
  };

  static async getInitialProps({ store }) {
    await store.dispatch(fetchMyCommunities());

    return {
      namespacesRequired: [],
    };
  }

  checkLoadMore = async () => {
    // eslint-disable-next-line no-shadow
    const { items, isAllowLoadMore, fetchMyCommunities } = this.props;

    if (!isAllowLoadMore) {
      return;
    }

    await fetchMyCommunities({
      offset: items.length,
    });
  };

  renderEmpty() {
    const { items } = this.props;

    if (items.length) {
      return <EmptyList headerText="Nothing is found" noIcon />;
    }

    return (
      <EmptyList headerText="No Subscriptions" subText="You have not subscribed to any community">
        <Link route="communities" passHref>
          <BigButton as="a">Find communities</BigButton>
        </Link>
      </EmptyList>
    );
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
