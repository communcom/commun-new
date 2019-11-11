import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { communityType } from 'types';
import { getCommunities } from 'store/actions/gate';

import CommunityRow from 'components/common/CommunityRow';
import EmptyList from 'components/common/EmptyList/EmptyList';
import { up } from '@commun/ui';
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

export default class Discover extends PureComponent {
  static propTypes = {
    userId: PropTypes.string,
    items: PropTypes.arrayOf(communityType).isRequired,
    isAllowLoadMore: PropTypes.bool.isRequired,

    getCommunities: PropTypes.func.isRequired,
  };

  static defaultProps = {
    userId: null,
  };

  static async getInitialProps({ store, parentInitialProps }) {
    await store.dispatch(
      getCommunities({
        userId: parentInitialProps.userId,
      })
    );

    return {
      userId: parentInitialProps.userId,
      namespacesRequired: [],
    };
  }

  checkLoadMore = async () => {
    // eslint-disable-next-line no-shadow
    const { userId, items, isAllowLoadMore, getCommunities } = this.props;

    if (!isAllowLoadMore) {
      return;
    }

    await getCommunities({
      userId,
      offset: items.length,
    });
  };

  renderEmpty() {
    const { items } = this.props;

    if (items.length) {
      return <EmptyList headerText="Nothing is found" noIcon />;
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
