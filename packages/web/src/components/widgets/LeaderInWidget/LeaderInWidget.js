/* eslint-disable no-shadow,prefer-arrow-callback,func-names */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { communityType } from 'types';
import { displayError, displaySuccess } from 'utils/toastsMessages';
import { fetchWidgetLeaderCommunities } from 'store/actions/gate';

import AsyncAction from 'components/common/AsyncAction';
import WidgetCommunityRow from 'components/widgets/common/WidgetCommunityRow';
import { WidgetCard, WidgetHeader, WidgetList, FollowButton } from '../common';

const ITEMS_LIMIT = 5;

export default function LeaderInWidget({ items, joinCommunity, leaveCommunity }) {
  const onClickToggleFollow = useCallback(
    async function(communityId, isSubscribed) {
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
    },
    [joinCommunity, leaveCommunity]
  );

  const renderButtons = useCallback(
    function({ communityId, isSubscribed }) {
      return (
        <AsyncAction onClickHandler={() => onClickToggleFollow(communityId, isSubscribed)}>
          <FollowButton className={`trending-communities__${isSubscribed ? 'unfollow' : 'follow'}`}>
            {isSubscribed ? 'Unfollow' : 'Follow'}
          </FollowButton>
        </AsyncAction>
      );
    },
    [onClickToggleFollow]
  );

  if (!items.length) {
    return null;
  }

  return (
    <WidgetCard>
      <WidgetHeader title="Leader in" />
      <WidgetList>
        {items.map(community => (
          <WidgetCommunityRow
            key={community.communityId}
            community={community}
            actions={renderButtons}
          />
        ))}
      </WidgetList>
    </WidgetCard>
  );
}

LeaderInWidget.propTypes = {
  items: PropTypes.arrayOf(communityType).isRequired,

  joinCommunity: PropTypes.func.isRequired,
  leaveCommunity: PropTypes.func.isRequired,
};

LeaderInWidget.getInitialProps = async ({ store, params: { userId } }) => {
  await store.dispatch(fetchWidgetLeaderCommunities({ userId, offset: 0, limit: ITEMS_LIMIT }));
};
