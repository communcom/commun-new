import { equals, sort } from 'ramda';

import { entitySelector } from 'store/selectors/common';
import { prepareLeaderCommunitiesSelector } from 'store/selectors/community';

export const getCommunityById = communityId => (dispatch, getState) =>
  entitySelector('communities', communityId)(getState());

export const compareSelectedCommunities = (ids1, ids2) => (dispatch, getState) => {
  const state = getState();

  const preparedIds1 = prepareLeaderCommunitiesSelector(ids1)(state);
  const preparedIds2 = prepareLeaderCommunitiesSelector(ids2)(state);

  if (preparedIds1 === preparedIds2) {
    return true;
  }

  if (!preparedIds1 || !preparedIds2) {
    return false;
  }

  return equals(sort(preparedIds1), sort(preparedIds2));
};
