/* eslint-disable no-shadow,prefer-arrow-callback,func-names */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { communityType } from 'types';
import { useTranslation } from 'shared/i18n';
import { displayError, displaySuccess } from 'utils/toastsMessages';
import { fetchWidgetLeaderCommunities } from 'store/actions/gate';

import AsyncAction from 'components/common/AsyncAction';
import WidgetCommunityRow from 'components/widgets/common/WidgetCommunityRow';
import { FollowButton, WidgetCard, WidgetHeader, WidgetList } from '../common';

const ITEMS_LIMIT = 5;

export default function LeaderInWidget({ items, joinCommunity, leaveCommunity }) {
  const { t } = useTranslation();

  const onClickToggleFollow = useCallback(
    async function(communityId, isSubscribed) {
      try {
        if (isSubscribed) {
          await leaveCommunity(communityId);
          displaySuccess(t('toastsMessages.community.unfollowed'));
        } else {
          await joinCommunity(communityId);
          displaySuccess(t('toastsMessages.community.followed'));
        }
      } catch (err) {
        if (err.message === 'Unauthorized') {
          return;
        }
        displayError(err);
      }
    },
    [joinCommunity, leaveCommunity, t]
  );

  const renderButtons = useCallback(
    function({ communityId, isSubscribed }) {
      return (
        <AsyncAction onClickHandler={() => onClickToggleFollow(communityId, isSubscribed)}>
          <FollowButton className={`trending-communities__${isSubscribed ? 'unfollow' : 'follow'}`}>
            {isSubscribed ? t('common.unfollow') : t('common.follow')}
          </FollowButton>
        </AsyncAction>
      );
    },
    [onClickToggleFollow, t]
  );

  if (!items.length) {
    return null;
  }

  return (
    <WidgetCard>
      <WidgetHeader title={t('widgets.leader_in.title')} />
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
