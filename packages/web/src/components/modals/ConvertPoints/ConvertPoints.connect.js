import { connect } from 'react-redux';

import { POINT_CONVERT_TYPE } from 'shared/constants';

import { transfer } from 'store/actions/commun';
import { statusSelector } from 'store/selectors/common';
import { userPointsSelector, userCommunPointSelector } from 'store/selectors/wallet';

import ConvertPoints from './ConvertPoints';

export default connect(
  (state, props) => {
    const userPoints = userPointsSelector(state);
    const communPoint = userCommunPointSelector(state);
    const { isTransferLoading, isLoading } = statusSelector('wallet')(state);

    const sellingPoint =
      props.convertType === POINT_CONVERT_TYPE.BUY
        ? communPoint
        : userPoints.find(point => point.symbol === props.pointName);

    return {
      points: userPoints,
      communPoint,
      isLoading: isTransferLoading || isLoading,
      sellingPoint,
    };
  },
  {
    transfer,
  }
)(ConvertPoints);
