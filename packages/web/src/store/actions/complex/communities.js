import { i18n } from 'shared/i18n';
import { displayError } from 'utils/toastsMessages';
import { openWallet } from 'store/actions/commun/point';
import {
  fetchCommunityMembersWidget,
  fetchLeadersWidget,
  fetchManagementCommunities,
  fetchMyCommunities,
  getCommunities,
  getTrendingCommunities,
} from 'store/actions/gate';
import { openConfirmDialog } from 'store/actions/modals/confirm';
import { entitySelector, statusSelector, statusWidgetSelector } from 'store/selectors/common';
import { userPointsSelector } from 'store/selectors/wallet';

export const fetchMyCommunitiesIfEmpty = () => async (dispatch, getState) => {
  const state = getState();

  const { isLoading, isEnd } = statusSelector('myCommunities')(state);

  if (!isLoading && !isEnd) {
    return dispatch(fetchMyCommunities());
  }

  return undefined;
};

export const fetchCommunitiesIfEmpty = () => async (dispatch, getState) => {
  const state = getState();

  const { isLoading, isEnd } = statusSelector('communities')(state);

  if (!isLoading && !isEnd) {
    return dispatch(getCommunities());
  }

  return undefined;
};

export const fetchLeaderCommunitiesIfEmpty = () => async (dispatch, getState) => {
  const state = getState();

  const { isLoading, isLoaded } = statusWidgetSelector('managementCommunities')(state);

  if (!isLoading && !isLoaded) {
    return dispatch(fetchManagementCommunities());
  }

  return undefined;
};

export const getTrendingCommunitiesIfEmpty = () => async (dispatch, getState) => {
  const state = getState();

  const { isLoading, isEnd } = statusWidgetSelector('trendingCommunities')(state);

  if (!isLoading && !isEnd) {
    return dispatch(getTrendingCommunities());
  }

  return undefined;
};

export const fetchLeadersWidgetIfEmpty = params => async (dispatch, getState) => {
  const state = getState();

  const { communityId, isLoading, isLoaded } = statusWidgetSelector('communityLeaders')(state);

  if (communityId !== params.communityId || (!isLoading && !isLoaded)) {
    return dispatch(fetchLeadersWidget(params));
  }

  return undefined;
};

export const fetchCommunityMembersWidgetIfEmpty = params => async (dispatch, getState) => {
  const state = getState();

  const { communityId, isLoading, isLoaded } = statusWidgetSelector('communityMembers')(state);

  if (communityId !== params.communityId || (!isLoading && !isLoaded)) {
    return dispatch(fetchCommunityMembersWidget(params));
  }

  return undefined;
};

export const openCommunityWalletIfNeed = communityId => async (dispatch, getState) => {
  const myPoints = userPointsSelector(getState());
  const token = myPoints.get(communityId);

  if (!token) {
    try {
      await dispatch(openWallet(communityId));
    } catch (err) {
      displayError(err);
    }
  }
};

export const getIsAllowedFollowCommunity = (communityId, unblock) => async (dispatch, getState) => {
  const state = getState();
  const community = entitySelector('communities', communityId)(state);
  const communitiesBlacklist = statusSelector(['communitiesBlacklist', 'order'])(state);
  let result = true;

  if (community?.isInBlacklist || communitiesBlacklist.includes(communityId)) {
    result = await dispatch(
      openConfirmDialog(i18n.t('modals.confirm_dialog.blocked_community'), {
        confirmText: i18n.t('common.follow'),
      })
    );

    if (result && unblock) {
      await dispatch(unblock(communityId));
    }
  }

  return result;
};

export const unfollowCommunityIfNeed = (communityId, unfollow) => async (dispatch, getState) => {
  const state = getState();
  const community = entitySelector('communities', communityId)(state);

  if (community?.isSubscribed) {
    await dispatch(unfollow(communityId));
  }
};
