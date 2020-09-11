import { createSelector } from 'reselect';

import { currentUnsafeUserIdSelector, currentUserIdSelector } from './auth';

export const isOwnerSelector = userId =>
  createSelector([currentUserIdSelector], loggedUserId => loggedUserId === userId);

export const isOwnerUnsafeSelector = userId =>
  createSelector([currentUnsafeUserIdSelector], loggedUserId => loggedUserId === userId);
