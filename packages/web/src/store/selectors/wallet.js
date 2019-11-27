import { createSelector } from 'reselect';

import { COMMUN_SYMBOL } from 'shared/constants';
import { dataSelector, createFastEqualSelector } from './common';

const EMPTY_COMMUN = { symbol: COMMUN_SYMBOL, logo: COMMUN_SYMBOL, name: 'Commun', balance: '0' };

export const userBalanceSelector = dataSelector(['wallet', 'balances']);

export const userPointsSelector = createFastEqualSelector([userBalanceSelector], points =>
  points.filter(point => point.symbol !== COMMUN_SYMBOL).sort((a, b) => b.balance - a.balance)
);

// FIXME after wallet changes
export const userCommunPointSelector = createSelector(
  [userBalanceSelector],
  points =>
    Object.assign(points.find(point => point.symbol === COMMUN_SYMBOL) || EMPTY_COMMUN, {
      name: 'Commun',
    })
);

// FIXME after wallet changes
export const userPoints2Selector = createFastEqualSelector(
  [userPointsSelector],
  points => new Map(points.map(point => [point.symbol, point]))
);

// FIXME after wallet changes
export const totalBalanceSelector = createSelector(
  [userPointsSelector, userCommunPointSelector],
  (points, commun) =>
    parseFloat(
      points.reduce((acc, curr) => acc + parseFloat(curr.price), parseFloat(commun.balance))
    ).toFixed(4)
);
