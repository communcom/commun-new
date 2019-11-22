import { createSelector } from 'reselect';

import { COMMUN_SYMBOL } from 'shared/constants';
import { dataSelector, createFastEqualSelector } from './common';

const EMPTY_COMMUN = { symbol: COMMUN_SYMBOL, logo: COMMUN_SYMBOL, name: 'Commun', balance: '0' };

export const userBalanceSelector = dataSelector(['wallet', 'balances']);

export const userPointsSelector = createFastEqualSelector([userBalanceSelector], points =>
  points.filter(point => point.symbol !== COMMUN_SYMBOL).sort((a, b) => b.balance - a.balance)
);

export const userCommunPointSelector = createSelector(
  [userBalanceSelector],
  points => points.find(point => point.symbol === COMMUN_SYMBOL) || EMPTY_COMMUN
);
