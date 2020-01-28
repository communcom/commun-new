/* eslint-disable no-shadow */

import React from 'react';
import PropTypes from 'prop-types';

import { communityType } from 'types';
import { displayError, displaySuccess } from 'utils/toastsMessages';

import AsyncAction from 'components/common/AsyncAction';
import WidgetCommunityRow from 'components/widgets/common/WidgetCommunityRow';
import { WidgetCard, WidgetHeader, WidgetList, FollowButton } from '../common';

const ITEMS_LIMIT = 5;

function LeaderInWidget({ items, joinCommunity, leaveCommunity }) {
  async function onClickToggleFollow(communityId, isSubscribed) {
    try {
      if (isSubscribed) {
        await leaveCommunity(communityId);
        displaySuccess('Community unfollowed');
      } else {
        await joinCommunity(communityId);
        displaySuccess('Community followed');
      }
    } catch (err) {
      if (err.message === 'Unauthorized') {
        return;
      }
      displayError(err);
    }
  }

  // eslint-disable-next-line react/prop-types
  function renderButtons({ communityId, isSubscribed }) {
    return (
      <AsyncAction onClickHandler={() => onClickToggleFollow(communityId, isSubscribed)}>
        <FollowButton className={`trending-communities__${isSubscribed ? 'unfollow' : 'follow'}`}>
          {isSubscribed ? 'Unfollow' : 'Follow'}
        </FollowButton>
      </AsyncAction>
    );
  }

  function renderCommunities() {
    return items
      .slice(0, ITEMS_LIMIT)
      .map(community => (
        <WidgetCommunityRow
          key={community.communityId}
          community={community}
          actions={renderButtons}
        />
      ));
  }

  if (!items.length) {
    return null;
  }

  return (
    <WidgetCard>
      <WidgetHeader title="Leader in" />
      <WidgetList>{renderCommunities()}</WidgetList>
    </WidgetCard>
  );
}

LeaderInWidget.propTypes = {
  items: PropTypes.arrayOf(communityType).isRequired,

  joinCommunity: PropTypes.func.isRequired,
  leaveCommunity: PropTypes.func.isRequired,
};

export default LeaderInWidget;
