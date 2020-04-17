import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'shared/routes';

import { communityType } from 'types';
import { withTranslation } from 'shared/i18n';
import { fetchLeaderCommunities } from 'store/actions/gate';

import EmptyList from 'components/common/EmptyList/EmptyList';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import { Wrapper, Items, CommunityRowStyled, BigButton } from '../common.styled';

@withTranslation()
export default class Manage extends PureComponent {
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
      // eslint-disable-next-line
      console.error(err);
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
            <CommunityRowStyled communityId={communityId} key={communityId} />
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
