import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, Card, up } from '@commun/ui';

import { communityType } from 'types';
import { withTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';
import { captureException } from 'utils/errors';
import { fetchLeaderCommunities } from 'store/actions/gate';

import CommunityRow from 'components/common/CommunityRow';
import EmptyList from 'components/common/EmptyList/EmptyList';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';

export const Wrapper = styled(Card)`
  padding: 15px;
`;

const Items = styled.ul`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(1, [col-start] minmax(0, 1fr));

  ${up.mobileLandscape} {
    grid-template-columns: repeat(2, [col-start] minmax(0, 1fr));
  }

  ${up.tablet} {
    grid-template-columns: repeat(1, [col-start] minmax(0, 1fr));
  }
`;

const CommunityRowStyled = styled(CommunityRow)`
  padding: 0;
`;

const BigButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 38px;
  appearance: none;
`;

@withTranslation()
export default class ManagedCommunities extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(communityType).isRequired,
    isAllowLoadMore: PropTypes.bool.isRequired,
    isAuthorized: PropTypes.bool,
    isAutoLogging: PropTypes.bool,

    fetchLeaderCommunities: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isAuthorized: false,
    isAutoLogging: false,
  };

  static async getInitialProps({ store }) {
    try {
      await store.dispatch(fetchLeaderCommunities());
    } catch (err) {
      captureException(err);
    }

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
    const { items, t } = this.props;

    if (items.length) {
      return <EmptyList noIcon />;
    }

    return (
      <EmptyList
        headerText={t('components.communities.no_found')}
        subText={t('components.communities.manage.no_found_desc')}
      >
        <Link route="communities" passHref>
          <BigButton as="a">{t('components.communities.find')}</BigButton>
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
            <CommunityRowStyled communityId={communityId} key={communityId} isLeaderboard />
          ))}
        </Items>
        {!items.length ? this.renderEmpty() : null}
      </InfinityScrollHelper>
    );
  }

  render() {
    const { isAuthorized, isAutoLogging } = this.props;

    if (!isAuthorized && !isAutoLogging) {
      return null;
    }

    return <Wrapper>{this.renderItems()}</Wrapper>;
  }
}
