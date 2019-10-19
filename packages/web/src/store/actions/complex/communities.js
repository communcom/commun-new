import { statusSelector, statusWidgetSelector } from 'store/selectors/common';
import { getCommunities, fetchMyCommunities, getTrendingCommunities } from 'store/actions/gate';

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

export const getTrendingCommunitiesIfEmpty = () => async (dispatch, getState) => {
  const state = getState();

  const { isLoading, isLoaded } = statusWidgetSelector('trendingCommunities')(state);

  if (!isLoading && !isLoaded) {
    return dispatch(getTrendingCommunities());
  }

  return undefined;
};
