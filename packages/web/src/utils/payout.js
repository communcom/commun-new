/* eslint-disable import/prefer-default-export */
import BigNum from 'bignumber.js';

export const payoutSum = payout =>
  ['author', 'curator', 'benefactor'].reduce((parentPrev, parentKey) => {
    const parent = payout[parentKey];
    if (!parent) {
      return parentPrev;
    }

    // Sum of token and vesting
    const childrenSum = ['token', 'vesting'].reduce((childrenPrev, childrenKey) => {
      const children = parent[childrenKey];
      if (!children) {
        return childrenPrev;
      }

      const { name, value } = children;

      if (!name || !value) {
        return childrenPrev;
      }

      // TODO: change value of ticker `name` by currency
      // eslint-disable-next-line no-param-reassign
      childrenPrev = childrenPrev.plus(value);

      return childrenPrev;
    }, new BigNum(0));

    // eslint-disable-next-line no-param-reassign
    parentPrev = parentPrev.plus(childrenSum);

    return parentPrev;
  }, new BigNum(0));
