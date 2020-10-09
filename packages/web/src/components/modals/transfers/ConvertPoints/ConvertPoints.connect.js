import { connect } from 'react-redux';

import { POINT_CONVERT_TYPE } from 'shared/constants';
import { convert, openCommunWallet, openWallet } from 'store/actions/commun';
import {
  getBuyPrice,
  getPointInfo,
  getSellPrice,
  waitTransactionAndCheckBalance,
} from 'store/actions/gate';
import { openModalSelectPoint } from 'store/actions/modals';
import { statusSelector } from 'store/selectors/common';
import { userCommunPointSelector, userPointsSelector } from 'store/selectors/wallet';

import ConvertPoints from './ConvertPoints';

export default connect(
  (state, props) => {
    const points = userPointsSelector(state);
    const communPoint = userCommunPointSelector(state);
    const { isTransferLoading, isLoading } = statusSelector('wallet')(state);

    // TODO: convertPoints
    const convertPoints = {};

    if (props.convertType === POINT_CONVERT_TYPE.BUY) {
      convertPoints.sellingPoint = communPoint;
      convertPoints.buyingPoint = points.has(props.symbol)
        ? points.get(props.symbol)
        : props.symbol;
    } else {
      convertPoints.sellingPoint = props.symbol
        ? points.get(props.symbol)
        : points.values().next().value;
      convertPoints.buyingPoint = communPoint;
    }

    return {
      points,
      communPoint,
      isLoading: isTransferLoading || isLoading,
      convertPoints,
    };
  },
  {
    convert,
    openWallet,
    waitTransactionAndCheckBalance,
    getSellPrice,
    getBuyPrice,
    getPointInfo,
    openModalSelectPoint,
    openCommunWallet,
  }
)(ConvertPoints);
