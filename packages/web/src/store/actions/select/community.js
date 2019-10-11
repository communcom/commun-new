/* eslint-disable import/prefer-default-export */

import { entitySelector } from 'store/selectors/common';

export const getCommunityById = communityId => (dispatch, getState) =>
  entitySelector('communities', communityId)(getState());
