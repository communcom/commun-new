import { connect } from 'react-redux';

import { transfer } from 'store/actions/commun';
import { waitTransactionAndCheckBalance } from 'store/actions/gate';
import { statusSelector } from 'store/selectors/common';
import { userPointsSelector, userCommunPointSelector } from 'store/selectors/wallet';

import SendPoints from './SendPoints';

export default connect(
  (state, props) => {
    const userPoints = userPointsSelector(state);
    const communPoint = userCommunPointSelector(state);
    const { isTransferLoading, isLoading } = statusSelector('wallet')(state);

    const selectedPoint = userPoints.find(point => point.symbol === props.pointName) || communPoint;

    return {
      points: userPoints,
      isLoading: isTransferLoading || isLoading,
      selectedPoint,
    };
  },
  {
    transfer,
    waitTransactionAndCheckBalance,
  }
)(SendPoints);
