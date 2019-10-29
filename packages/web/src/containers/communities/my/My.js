import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, up } from '@commun/ui';
import { communityType } from 'types';
import { fetchMyCommunities } from 'store/actions/gate';

import CommunityRow from 'components/common/CommunityRow';
import EmptyList from 'components/common/EmptyList/EmptyList';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';

const Wrapper = styled.div``;

const Items = styled.ul`
  display: grid;
  grid-gap: 40px;
  grid-template-columns: repeat(1, [col-start] 1fr);

  ${up.desktop} {
    grid-template-columns: repeat(2, [col-start] 1fr);
  }
`;

const CommunityRowStyled = styled(CommunityRow)`
  padding: 0;
`;

const BigButton = styled(Button)`
  height: 38px;
`;

export default class My extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(communityType).isRequired,
    isOwner: PropTypes.bool.isRequired,
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

    return <EmptyList headerText="No Communities" />;
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
