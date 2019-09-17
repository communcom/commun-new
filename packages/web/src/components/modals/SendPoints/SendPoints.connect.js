import { connect } from 'react-redux';

import { transferToken } from 'store/actions/commun';
import { statusSelector, dataSelector } from 'store/selectors/common';
import { calculateAmount } from 'utils/wallet';

import SendPoints, { DEFAULT_TOKEN } from './SendPoints';

export default connect(
  (state, props) => {
    const { balances } = dataSelector('wallet')(state);

    let points;
    let selectedPoint;

    // TODO: replace by followers/followings
    const users = [
      { name: 'joseph.kalu', avatarUrl: null },
      { name: 'nickshtefan', avatarUrl: null },
      { name: 'john.doe', avatarUrl: null },
      { name: 'bacher', avatarUrl: null },
      { name: 'funny.man', avatarUrl: null },
      { name: 'tst2rjuxkzqb', avatarUrl: null },
      { name: 'tst1cnokzfqp', avatarUrl: null },
    ];

    if (balances && balances.length) {
      points = balances.map(balance => ({
        name: balance.sym,
        // TODO: replace by real community id
        communityId: 'gls',
        balance: Number(calculateAmount({ amount: balance.amount, decs: balance.decs })),
      }));

      if (points.length) {
        if (props.pointName) {
          selectedPoint = points.find(point => point.name === props.pointName);
        } else {
          selectedPoint = points.find(point => point.name === DEFAULT_TOKEN);
        }
      }
    }

    const { isTransferLoading, isLoading } = statusSelector('wallet')(state);

    return {
      points,
      isLoading: isTransferLoading || isLoading,
      selectedPoint: selectedPoint || points?.[0],
      users,
    };
  },
  {
    transferToken,
  }
)(SendPoints);
