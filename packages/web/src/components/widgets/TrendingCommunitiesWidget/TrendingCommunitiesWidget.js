/* eslint-disable no-shadow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { communityType } from 'types';
import { Link } from 'shared/routes';
import { withTranslation } from 'shared/i18n';
import { getTrendingCommunitiesIfEmpty } from 'store/actions/complex';
import { displayError, displaySuccess } from 'utils/toastsMessages';

import AsyncAction from 'components/common/AsyncAction';
import SeeAll from 'components/common/SeeAll';
import WidgetCommunityRow from 'components/widgets/common/WidgetCommunityRow';

import { WidgetCard, WidgetHeader, WidgetList, FollowButton } from '../common';

const ITEMS_LIMIT = 5;

@withTranslation()
export default class TrendingCommunitiesWidget extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(communityType).isRequired,
    isEnd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    forceSubscribed: PropTypes.arrayOf(PropTypes.string).isRequired,
    joinCommunity: PropTypes.func.isRequired,
    getTrendingCommunitiesIfEmpty: PropTypes.func.isRequired,
  };

  static async getInitialProps({ store }) {
    try {
      await store.dispatch(getTrendingCommunitiesIfEmpty());
    } catch (err) {
      // В случае ошибки ничего не делаем.
      // eslint-disable-next-line no-console
      console.error('fetchCommunitiesIfEmpty failed:', err);
    }
  }

  componentDidMount() {
    // getInitialProps может не сработать или вообще может быть не вызван,
    // на всякий случай вызываем ещё раз проверку данных на стороне клиента.
    this.load();
  }

  componentDidUpdate() {
    const { isLoading, isEnd } = this.props;

    if (isEnd || isLoading) {
      return;
    }

    const items = this.getFilteredItems();

    if (items.length < ITEMS_LIMIT + 1) {
      this.load();
    }
  }

  getFilteredItems() {
    const { items, forceSubscribed } = this.props;

    return items.filter(item => !item.isSubscribed && !forceSubscribed.includes(item.communityId));
  }

  load() {
    const { getTrendingCommunitiesIfEmpty } = this.props;

    getTrendingCommunitiesIfEmpty().catch(err => {
      // eslint-disable-next-line no-console
      console.error(err);
    });
  }

  onSubscribeClick = async communityId => {
    const { joinCommunity } = this.props;
    try {
      await joinCommunity(communityId);
      displaySuccess('Community followed');
    } catch (err) {
      displayError(err);
    }
  };

  renderButtons = ({ communityId, isSubscribed }) => {
    const { t } = this.props;

    if (isSubscribed) {
      return null;
    }

    return (
      <AsyncAction onClickHandler={() => this.onSubscribeClick(communityId)}>
        <FollowButton className="trending-communities__subscribe">
          {t('common.follow')}
        </FollowButton>
      </AsyncAction>
    );
  };

  renderCommunities() {
    const items = this.getFilteredItems();

    return items
      .slice(0, ITEMS_LIMIT)
      .map(community => (
        <WidgetCommunityRow
          key={community.communityId}
          community={community}
          actions={this.renderButtons}
        />
      ));
  }

  render() {
    const { items, t } = this.props;
    const filteredCommunities = this.renderCommunities();

    if (!items.length || !filteredCommunities.length) {
      return null;
    }

    return (
      <WidgetCard>
        <WidgetHeader
          title={t('widgets.trending_communities.title')}
          right={
            <Link route="communities" passHref>
              <SeeAll />
            </Link>
          }
        />
        <WidgetList>{filteredCommunities}</WidgetList>
      </WidgetCard>
    );
  }
}
