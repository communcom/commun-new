/* eslint-disable import/prefer-default-export */
import { createSelector } from 'reselect';

import { dataSelector, createFastEqualSelector } from './common';

const EMPTY_COMMUN = { symbol: 'COMMUN', logo: 'COMMUN', balance: '0', decs: 4 };

export const userBalanceSelector = dataSelector(['wallet', 'balances']);

export const userPointsSelector = createFastEqualSelector([userBalanceSelector], points =>
  points
    .filter(point => point.symbol !== 'COMMUN')
    .sort((a, b) => a.balance - b.balance)
    .reverse()
);

export const userCommunPointSelector = createSelector(
  [userBalanceSelector],
  points => points.find(point => point.symbol === 'COMMUN') || EMPTY_COMMUN
);
