import { statusSelector } from 'store/selectors/common';
import { getCommunities, fetchMyCommunities } from 'store/actions/gate';

export const fetchMyCommunitiesIfEmpty = () => (dispatch, getState) => {
  const state = getState();

  const { isLoading, isEnd } = statusSelector('myCommunities')(state);

  if (!isLoading && !isEnd) {
    return dispatch(fetchMyCommunities());
  }

  return undefined;
};

export const fetchCommunitiesIfEmpty = () => (dispatch, getState) => {
  const state = getState();

  const { isLoading, isEnd } = statusSelector('communities')(state);

  if (!isLoading && !isEnd) {
    return dispatch(getCommunities());
  }

  return undefined;
};
