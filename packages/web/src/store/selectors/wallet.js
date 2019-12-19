import { createSelector } from 'reselect';

import { COMMUN_SYMBOL } from 'shared/constants';
import { dataSelector, createFastEqualSelector, uiSelector } from './common';

export const userBalanceSelector = createFastEqualSelector(
  [dataSelector(['wallet', 'balances'])],
  balances =>
    new Map(balances.sort((a, b) => b.balance - a.balance).map(point => [point.symbol, point]))
);

export const userPointSelector = communityId => state =>
  userBalanceSelector(state).get(communityId);

export const userCommunPointSelector = createSelector(
  [userBalanceSelector],
  balances =>
    balances.has(COMMUN_SYMBOL)
      ? { ...balances.get(COMMUN_SYMBOL), name: 'Commun' }
      : {
          symbol: COMMUN_SYMBOL,
          name: 'Commun',
          balance: '0',
          needOpenBalance: true,
        }
);

export const userPoints2Selector = createSelector(
  [userBalanceSelector],
  balances => {
    const clone = new Map(balances);
    clone.delete(COMMUN_SYMBOL);

    return clone;
  }
);

export const totalBalanceSelector = createSelector(
  [userPoints2Selector, userCommunPointSelector],
  (points, commun) =>
    parseFloat(
      Array.from(points.values()).reduce(
        (acc, curr) => acc + parseFloat(curr.price),
        parseFloat(commun.balance)
      )
    ).toFixed(4)
);

export const transferHistorySelector = dataSelector(['wallet', 'transferHistory']);

export const pointHistorySelector = createFastEqualSelector(
  [dataSelector(['wallet', 'pointHistory']), uiSelector(['wallet', 'pointInfoSymbol'])],
  (pointHistory, pointInfoSymbol) => pointHistory[pointInfoSymbol]
);
