/* eslint-disable no-shadow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { communityType } from 'types';
import { Link } from 'shared/routes';
import { getTrendingCommunitiesIfEmpty } from 'store/actions/complex';
import { displayError } from 'utils/toastsMessages';

import AsyncAction from 'components/common/AsyncAction';
import SeeAll from 'components/common/SeeAll';
import WidgetCommunityRow from 'components/widgets/common/WidgetCommunityRow';

import { WidgetCard, WidgetHeader, WidgetList, FollowButton } from '../common';

const ITEMS_LIMIT = 5;

export default class TrendingCommunitiesWidget extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(communityType).isRequired,
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
    const { getTrendingCommunitiesIfEmpty } = this.props;

    // getInitialProps может не сработать или вообще может быть не вызван,
    // на всякий случай вызываем ещё раз проверку данных на стороне клиента.
    getTrendingCommunitiesIfEmpty().catch(err =>
      // eslint-disable-next-line no-console
      console.error(err)
    );
  }

  onSubscribeClick = async communityId => {
    const { joinCommunity } = this.props;
    try {
      await joinCommunity(communityId);
    } catch (err) {
      displayError(err);
    }
  };

  renderButtons = ({ communityId, isSubscribed }) => {
    if (isSubscribed) {
      return null;
    }

    return (
      <AsyncAction onClickHandler={() => this.onSubscribeClick(communityId)}>
        <FollowButton className="trending-communities__subscribe">Follow</FollowButton>
      </AsyncAction>
    );
  };

  renderCommunities() {
    const { items } = this.props;

    return items
      .filter(item => !item.isSubscribed)
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
    const { items } = this.props;
    const filteredCommunities = this.renderCommunities();

    if (!items.length || !filteredCommunities.length) {
      return null;
    }

    return (
      <WidgetCard>
        <WidgetHeader
          title="Trending communities"
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
