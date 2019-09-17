import { connect } from 'react-redux';

import { dataSelector, statusSelector } from 'store/selectors/common';
import { calculateAmount } from 'utils/wallet';

import ConvertPoints, { DEFAULT_TOKEN } from './ConvertPoints';

export default connect((state, props) => {
  const { balances } = dataSelector('wallet')(state);

  let points;
  let selectedPoint;

  const obtainedPoints = [
    { name: 'COMMUN', avatarUrl: null },
    { name: 'GLS', avatarUrl: null },
    { name: 'OVERWATCH', avatarUrl: null },
    { name: 'ADME', avatarUrl: null },
    { name: 'CHTO-TO ESCHO', avatarUrl: null },
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

  const { isConvertLoading } = statusSelector('wallet')(state);

  return {
    isLoading: isConvertLoading,
    points,
    obtainedPoints,
    selectedPoint: selectedPoint || points?.[0],
  };
})(ConvertPoints);
