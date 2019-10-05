/* eslint-disable import/prefer-default-export */
import { createSelector } from 'reselect';

import { dataSelector, createDeepEqualSelector } from './common';

export const userBalanceSelector = dataSelector(['wallet', 'balances']);

export const userPointsSelector = createDeepEqualSelector([userBalanceSelector], points =>
  points
    .filter(point => point.symbol !== 'COMMUN')
    .sort((a, b) => a.balance - b.balance)
    .reverse()
);

export const userCommunPointSelector = createSelector(
  [userBalanceSelector],
  points => points.find(point => point.symbol === 'COMMUN')
);
